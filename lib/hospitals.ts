import { createClient } from "@supabase/supabase-js";

export type MapHospital = {
  id: string;
  name: string;
  type: string | null;
  latitude: number;
  longitude: number;
  logo_url: string | null;
  website: string | null;
  formatted_address: string | null;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Used by the homepage server component to seed the map with active hospital
// pins. Returns [] (not throw) if Supabase isn't configured or the query fails
// — the marketing site must never 500 because the CRM is unreachable.
export async function fetchActiveHospitals(): Promise<MapHospital[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    let { data, error } = await supabase
      .from("hospitals")
      .select("id, name, type, latitude, longitude, logo_url, website, formatted_address")
      .eq("status", "active")
      .not("latitude", "is", null)
      .not("longitude", "is", null)
      .not("name", "ilike", "%trial%")
      .not("name", "ilike", "%test%")
      .not("name", "ilike", "%statdoctor%");

    // Graceful fallback for the brief window where migration 010 (website
    // column) hasn't been applied yet — retry without the website column so
    // the rest of the map still renders.
    if (error && /column .*website/i.test(error.message)) {
      const retry = await supabase
        .from("hospitals")
        .select("id, name, type, latitude, longitude, logo_url")
        .eq("status", "active")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .not("name", "ilike", "%trial%")
        .not("name", "ilike", "%test%")
        .not("name", "ilike", "%statdoctor%");
      data = retry.data?.map((h) => ({ ...h, website: null, formatted_address: null })) ?? null;
      error = retry.error;
    }

    if (error || !data) return [];
    return data.filter(
      (h): h is MapHospital => typeof h.latitude === "number" && typeof h.longitude === "number",
    );
  } catch {
    return [];
  }
}

// Counts of currently live (status="Active") shifts per hospital. Keys are
// the hospital name lowercased + whitespace-normalised so the map can match
// CRM hospital rows to the shift rows (which only store hospital_name text).
export async function fetchActiveShiftCounts(): Promise<Record<string, number>> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return {};
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase
      .from("shifts")
      .select("hospital_name")
      .eq("status", "Active");
    if (error || !data) return {};
    const counts: Record<string, number> = {};
    for (const s of data) {
      const name = (s as { hospital_name?: string | null }).hospital_name;
      if (!name) continue;
      const key = name.toLowerCase().trim().replace(/\s+/g, " ");
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  } catch {
    return {};
  }
}

export function normaliseHospitalKey(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

export type AusState = "VIC" | "NSW" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

const STATE_CODES: AusState[] = ["VIC", "NSW", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

// Google's formatted_address strings for AU hospitals reliably contain the
// state code right before the postcode — e.g. "10 Smith St, Hervey Bay QLD
// 4655, Australia". Scan for the first standalone state code we find.
// Returns null when nothing matches so callers can fall back gracefully.
export function deriveAuState(address: string | null | undefined): AusState | null {
  if (!address) return null;
  const m = address.match(/\b(VIC|NSW|QLD|WA|SA|TAS|ACT|NT)\b/);
  if (m && (STATE_CODES as string[]).includes(m[1])) return m[1] as AusState;
  return null;
}

export type LiveStats = {
  activeShifts: number;
  confirmedShifts: number;
  avgRate: number;
  totalValue: number;
  hospitalCount: number;
};

// Aggregate metrics that mirror the CRM admin dashboard, surfaced on the
// public homepage just below the map. All values reflect the current state
// of the CRM at request time (no caching).
export async function fetchLiveStats(): Promise<LiveStats> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return { activeShifts: 0, confirmedShifts: 0, avgRate: 0, totalValue: 0, hospitalCount: 0 };
  }
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const [activeCountRes, confirmedCountRes, activeRowsRes] = await Promise.all([
      supabase
        .from("shifts")
        .select("id", { count: "exact", head: true })
        .eq("status", "Active")
        .not("hospital_name", "ilike", "%trial%")
        .not("hospital_name", "ilike", "%test%")
        .not("hospital_name", "ilike", "%statdoctor%"),
      // Confirmed count intentionally NOT filtered for test/trial/statdoctor
      // so the public tile matches the original number shown in the CRM
      // dashboard.
      supabase
        .from("shifts")
        .select("id", { count: "exact", head: true })
        .eq("status", "Confirmed"),
      // Pull active shift rate + duration so we can compute avg rate, total
      // value, and distinct hospital count client-side.
      supabase
        .from("shifts")
        .select("hospital_name, rate_per_hour, start_time, end_time")
        .eq("status", "Active")
        .not("hospital_name", "ilike", "%trial%")
        .not("hospital_name", "ilike", "%test%")
        .not("hospital_name", "ilike", "%statdoctor%")
        .limit(10000),
    ]);

    let rateSum = 0;
    let rateCount = 0;
    let totalValue = 0;
    const hospitals = new Set<string>();
    for (const row of (activeRowsRes.data ?? []) as Array<{
      hospital_name: string | null;
      rate_per_hour: number | null;
      start_time: string | null;
      end_time: string | null;
    }>) {
      if (row.hospital_name) hospitals.add(row.hospital_name.toLowerCase().trim());
      const rate = normaliseRate(row.rate_per_hour);
      const effectiveRate = rate > 0 ? rate : FALLBACK_RATE;
      if (rate > 0) {
        rateSum += rate;
        rateCount++;
      }
      // Shift value = effective hourly rate × shift duration (hours)
      if (row.start_time && row.end_time) {
        const ms = new Date(row.end_time).getTime() - new Date(row.start_time).getTime();
        const hours = ms > 0 ? ms / 3_600_000 : 0;
        totalValue += effectiveRate * hours;
      }
    }

    return {
      activeShifts: activeCountRes.count ?? 0,
      confirmedShifts: confirmedCountRes.count ?? 0,
      avgRate: rateCount > 0 ? Math.round(rateSum / rateCount) : FALLBACK_RATE,
      totalValue: Math.round(totalValue),
      hospitalCount: hospitals.size,
    };
  } catch {
    return { activeShifts: 0, confirmedShifts: 0, avgRate: 0, totalValue: 0, hospitalCount: 0 };
  }
}

export type LiveShift = {
  id: string;
  hospital: string;
  state: string;
  role: string;
  rate: string;
  logoUrl: string | null; // matched from public.hospitals by name
  postedAt: string; // ISO timestamp — when the shift was posted
  startsAt: string | null; // ISO date — only set for upcoming-week shifts
  variant: "upcoming" | "recent";
};

const AU_STATES = ["VIC", "NSW", "QLD", "SA", "WA", "TAS", "NT", "ACT"];

function extractState(location: string | null | undefined): string {
  if (!location) return "";
  const match = location.toUpperCase().match(new RegExp(`\\b(${AU_STATES.join("|")})\\b`));
  return match?.[1] ?? "";
}

function normaliseRate(rate: number | null | undefined): number {
  // Some admin-portal rows store rate * 10 (e.g. 3050 = $305/hr). Normalise
  // values above 1000 by dividing by 10 to stay in a realistic AU medical
  // hourly range. Smaller positive values are taken as plain dollars.
  const raw = rate ?? 0;
  if (raw > 1000) return Math.round(raw / 10);
  if (raw > 0) return Math.round(raw);
  return 0;
}

const FALLBACK_RATE = 200;

function formatRate(rate: number | null | undefined): string {
  const dollars = normaliseRate(rate);
  // Hospitals that haven't entered a rate yet (or set it to 0 in the admin
  // portal) display as the platform's typical baseline rather than an
  // off-putting $0/hr.
  return `$${dollars > 0 ? dollars : FALLBACK_RATE}/hr`;
}

function buildRoleLabel(specialty: string | null | undefined, skill: string | null | undefined): string {
  const sp = (specialty || "").trim();
  const sk = (skill || "").trim();
  if (sp && sk) return `${sk} · ${sp.replace(/ Medicine$/i, "")}`;
  return sp || sk || "Locum";
}

type ShiftRow = {
  id: string;
  hospital_name: string;
  hospital_location: string | null;
  specialty: string | null;
  skill_level: string | null;
  rate_per_hour: number | null;
  created_at: string;
  shift_date: string | null;
};

function rowToLiveShift(
  r: ShiftRow,
  variant: "upcoming" | "recent",
  logoByName: Map<string, string>,
): LiveShift {
  return {
    id: r.id,
    hospital: r.hospital_name,
    state: extractState(r.hospital_location),
    role: buildRoleLabel(r.specialty, r.skill_level),
    rate: formatRate(r.rate_per_hour),
    logoUrl: logoByName.get(normaliseHospitalKey(r.hospital_name)) ?? null,
    postedAt: r.created_at,
    startsAt: r.shift_date,
    variant,
  };
}

function pickDistinct(
  rows: ShiftRow[],
  variant: "upcoming" | "recent",
  limit: number,
  excludeKeys: Set<string>,
  logoByName: Map<string, string>,
): LiveShift[] {
  const picked: LiveShift[] = [];
  for (const r of rows) {
    const role = buildRoleLabel(r.specialty, r.skill_level);
    const key = `${r.hospital_name.toLowerCase()}|${role.toLowerCase()}`;
    if (excludeKeys.has(key)) continue;
    excludeKeys.add(key);
    picked.push(rowToLiveShift(r, variant, logoByName));
    if (picked.length >= limit) break;
  }
  return picked;
}

// Live Shifts Feed source: 3 distinct upcoming shifts (starting within the
// next week, soonest first) followed by 2 distinct most-recently-posted
// shifts. If either bucket is short, the other backfills so the feed always
// has up to 5 entries.
export async function fetchLiveShifts(limit = 5): Promise<LiveShift[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const weekAhead = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekAheadStr = weekAhead.toISOString().slice(0, 10);

    // Build a fresh query for each call. The Supabase query builder is
    // mutable, so reusing one between the upcoming and recent fetches would
    // leak filters from one into the other (e.g. the recent fetch would
    // inherit the shift_date BETWEEN today AND +7d filter, hiding every
    // shift posted for a date more than a week out).
    const buildBase = () =>
      supabase
        .from("shifts")
        .select(
          "id, hospital_name, hospital_location, specialty, skill_level, rate_per_hour, created_at, shift_date",
        )
        .eq("status", "Active")
        .not("hospital_name", "is", null)
        .not("hospital_name", "ilike", "%trial%")
        .not("hospital_name", "ilike", "%test%")
        .not("hospital_name", "ilike", "%statdoctor%");

    const [upcomingRes, recentRes, hospitalsRes] = await Promise.all([
      buildBase()
        .gte("shift_date", todayStr)
        .lte("shift_date", weekAheadStr)
        .order("shift_date", { ascending: true })
        .limit(500),
      buildBase()
        .order("created_at", { ascending: false })
        .limit(500),
      supabase
        .from("hospitals")
        .select("name, logo_url")
        .not("logo_url", "is", null),
    ]);

    const upcomingRows = (upcomingRes.data ?? []) as ShiftRow[];
    const recentRows = (recentRes.data ?? []) as ShiftRow[];

    // Map of normalised hospital name → logo URL so each shift row can
    // resolve its hospital's logo without an extra round-trip per row.
    const logoByName = new Map<string, string>();
    for (const h of (hospitalsRes.data ?? []) as Array<{ name: string | null; logo_url: string | null }>) {
      if (h.name && h.logo_url) {
        logoByName.set(normaliseHospitalKey(h.name), h.logo_url);
      }
    }

    const seen = new Set<string>();
    const upcomingPicks = pickDistinct(upcomingRows, "upcoming", 3, seen, logoByName);
    const recentPicks = pickDistinct(recentRows, "recent", 2, seen, logoByName);

    // If either bucket fell short, top up from the other so we still hit
    // the target count.
    const combined = [...upcomingPicks, ...recentPicks];
    if (combined.length < limit) {
      const upcomingExtra = pickDistinct(upcomingRows, "upcoming", limit - combined.length, seen, logoByName);
      combined.push(...upcomingExtra);
    }
    if (combined.length < limit) {
      const recentExtra = pickDistinct(recentRows, "recent", limit - combined.length, seen, logoByName);
      combined.push(...recentExtra);
    }
    return combined.slice(0, limit);
  } catch {
    return [];
  }
}
