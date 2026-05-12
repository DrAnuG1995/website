"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { HOSPITALS as FALLBACK_HOSPITALS } from "./hospitals";
import { normaliseHospitalKey, type MapHospital } from "@/lib/hospitals";
import Counter from "@/components/Counter";

const IDLE_RETURN_MS = 60_000;

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

const AU_CENTER = { lat: -28, lng: 134.5 };
// Bounds form a snug box around Australia + a small Pacific/PNG buffer
// so the user can't pan into Asia or the Pacific Ocean. Kept loose enough
// that the elastic restriction (strictBounds: false) never traps the
// camera at MIN_ZOOM on mobile — it just nudges them back when they try
// to drag past. If you tighten further, also bump MIN_ZOOM or the
// viewport will fail to render the bounds at the lowest zoom level.
const AU_BOUNDS = {
  north: -5, // just above Cape York / PNG
  south: -48, // just below Tasmania
  west: 108, // just west of WA coast
  east: 160, // east enough to include NZ approach
};
const OVERVIEW_ZOOM = 4.2;
const MIN_ZOOM = 4;
const MAX_ZOOM = 18;

const DEFAULT_HOSPITAL_ZOOM = 16;

// Scales the marker visual size based on map zoom so logos feel proportionate
// at every level — pin-sized when you're looking at the whole continent,
// bigger and more readable when you're zoomed into a city or building.
function zoomToScale(zoom: number): number {
  const stops: [number, number][] = [
    [3, 0.85],
    [6, 1.0],
    [10, 1.45],
    [14, 1.95],
    [17, 2.4],
  ];
  if (zoom <= stops[0][0]) return stops[0][1];
  if (zoom >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [z1, s1] = stops[i];
    const [z2, s2] = stops[i + 1];
    if (zoom >= z1 && zoom <= z2) {
      return s1 + ((s2 - s1) * (zoom - z1)) / (z2 - z1);
    }
  }
  return 1;
}

type Pin = {
  id: string;
  name: string;
  type: string | null;
  lat: number;
  lng: number;
  logoUrl: string | null;
  website: string | null;
  liveShifts: number;
  state?: string;
  zoom?: number;
};

function buildMarkerElement(pin: Pin): HTMLDivElement {
  const el = document.createElement("div");
  el.className = pin.logoUrl ? "sd-marker sd-marker--logo" : "sd-marker sd-marker--dot";
  if (pin.logoUrl) {
    const img = document.createElement("img");
    img.src = pin.logoUrl;
    img.alt = pin.name;
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.onerror = () => {
      // If the logo fails to load, downgrade to a dot marker so the pin
      // doesn't render as a broken-image icon on the map.
      el.classList.remove("sd-marker--logo");
      el.classList.add("sd-marker--dot");
      img.remove();
    };
    el.appendChild(img);
  }
  return el;
}

function toPins(crm: MapHospital[], shiftCounts: Record<string, number> | undefined): Pin[] {
  const liveFor = (name: string) => (shiftCounts ? shiftCounts[normaliseHospitalKey(name)] ?? 0 : 0);
  if (crm.length > 0) {
    return crm.map((h) => ({
      id: h.id,
      name: h.name,
      type: h.type,
      lat: h.latitude,
      lng: h.longitude,
      logoUrl: h.logo_url,
      website: h.website,
      liveShifts: liveFor(h.name),
    }));
  }
  // Fallback for when the CRM hasn't been populated yet — keeps the map
  // populated during the migration window so the page never renders empty.
  return FALLBACK_HOSPITALS.map((h, i) => ({
    id: `fallback-${i}`,
    name: h.name,
    type: h.type,
    lat: h.lat,
    lng: h.lng,
    logoUrl: h.logoUrl ?? null,
    website: null,
    liveShifts: liveFor(h.name),
    state: h.state,
    zoom: h.zoom,
  }));
}

export default function HeroMap({
  hospitals: initial,
  shiftCounts: initialShiftCounts,
}: {
  hospitals: MapHospital[];
  shiftCounts: Record<string, number>;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ marker: google.maps.marker.AdvancedMarkerElement; el: HTMLDivElement }[]>([]);
  const advCtorRef = useRef<typeof google.maps.marker.AdvancedMarkerElement | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const idleTimerRef = useRef<number | null>(null);
  const wheelHandlerRef = useRef<((e: WheelEvent) => void) | null>(null);

  const [crmHospitals, setCrmHospitals] = useState<MapHospital[]>(initial);
  const [shiftCounts, setShiftCounts] = useState<Record<string, number>>(initialShiftCounts ?? {});
  const pins = useMemo<Pin[]>(() => toPins(crmHospitals, shiftCounts), [crmHospitals, shiftCounts]);
  const pinsRef = useRef<Pin[]>(pins);
  pinsRef.current = pins;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const focusHospital = (id: string) => {
    if (!mapRef.current) return;
    const h = pinsRef.current.find((p) => p.id === id);
    if (!h) return;
    activeIdRef.current = id;
    setActiveId(id);
    mapRef.current.panTo({ lat: h.lat, lng: h.lng });
    mapRef.current.setZoom(h.zoom ?? DEFAULT_HOSPITAL_ZOOM);
  };

  const clearIdleTimer = () => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const goOverview = () => {
    clearIdleTimer();
    if (!mapRef.current) return;
    activeIdRef.current = null;
    setActiveId(null);
    mapRef.current.panTo(AU_CENTER);
    mapRef.current.setZoom(OVERVIEW_ZOOM);
  };

  // Init map (once)
  useEffect(() => {
    if (!mapContainer.current || mapRef.current || !KEY) return;

    setOptions({
      key: KEY,
      v: "weekly",
    });

    let cancelled = false;

    Promise.all([importLibrary("maps"), importLibrary("marker")]).then(([maps, marker]) => {
      if (cancelled || !mapContainer.current) return;
      const { Map: GoogleMap } = maps as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = marker as google.maps.MarkerLibrary;
      advCtorRef.current = AdvancedMarkerElement;

      const map = new GoogleMap(mapContainer.current, {
        center: AU_CENTER,
        zoom: OVERVIEW_ZOOM,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        restriction: { latLngBounds: AU_BOUNDS, strictBounds: false },
        disableDefaultUI: true,
        zoomControl: true,
        // Disable Google's built-in scroll-wheel zoom — it ignores the
        // cursor under the elastic bounds restriction. We replace it below
        // with a wheel listener that explicitly zooms toward the cursor.
        scrollwheel: false,
        gestureHandling: "greedy",
        clickableIcons: false,
        backgroundColor: "#f5f0e8",
        mapTypeId: "roadmap",
        // DEMO_MAP_ID is a free Google-provided Map ID that enables vector
        // rendering and AdvancedMarkerElement. Swap with a custom Map ID
        // (Cloud Console → Map Management) for production styling.
        mapId: "DEMO_MAP_ID",
      });
      mapRef.current = map;
      if (typeof window !== "undefined") {
        (window as unknown as { __sdMap?: google.maps.Map }).__sdMap = map;
      }

      // Cursor-centric wheel zoom: keep the geographic point under the
      // mouse cursor fixed on screen as the user zooms in or out.
      // Wheel events are accumulated so a trackpad's many small events
      // result in one zoom step per ~100 units of deltaY.
      let wheelAccum = 0;
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        wheelAccum += e.deltaY;
        const threshold = 60;
        if (Math.abs(wheelAccum) < threshold) return;
        const direction = wheelAccum < 0 ? 1 : -1;
        wheelAccum = 0;

        const oldZoom = map.getZoom() ?? OVERVIEW_ZOOM;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.round(oldZoom) + direction));
        if (newZoom === oldZoom) return;

        const rect = mapContainer.current!.getBoundingClientRect();
        const dx = e.clientX - rect.left - rect.width / 2;
        const dy = e.clientY - rect.top - rect.height / 2;

        map.setZoom(newZoom);
        const f = Math.pow(2, newZoom - oldZoom);
        // Pan so the geographic point that was under the cursor stays
        // under the cursor after the zoom step (formula: dx * (f - 1)).
        map.panBy(dx * (f - 1), dy * (f - 1));
      };
      mapContainer.current.addEventListener("wheel", onWheel, { passive: false });
      wheelHandlerRef.current = onWheel;

      // Push the current zoom-based scale into a CSS var on the map container
      // so all markers (existing + future) read from it.
      const applyZoomScale = () => {
        const z = map.getZoom() ?? OVERVIEW_ZOOM;
        mapContainer.current?.style.setProperty("--sd-marker-scale", String(zoomToScale(z)));
      };
      applyZoomScale();
      map.addListener("zoom_changed", applyZoomScale);

      setReady(true);
    });

    return () => {
      cancelled = true;
      markersRef.current.forEach(({ marker }) => (marker.map = null));
      markersRef.current = [];
      if (wheelHandlerRef.current && mapContainer.current) {
        mapContainer.current.removeEventListener("wheel", wheelHandlerRef.current);
      }
      wheelHandlerRef.current = null;
      mapRef.current = null;
    };
  }, []);

  // (Re)render markers whenever the pin list changes. Replaces markers in
  // place so realtime CRM updates pop a pin in without rebuilding the map.
  useEffect(() => {
    if (!ready || !mapRef.current || !advCtorRef.current) return;
    const map = mapRef.current;
    const Adv = advCtorRef.current;

    markersRef.current.forEach(({ marker }) => (marker.map = null));
    markersRef.current = [];

    pins.forEach((h) => {
      const el = buildMarkerElement(h);
      const marker = new Adv({
        position: { lat: h.lat, lng: h.lng },
        map,
        title: h.name,
        content: el,
      });
      // Handle click on the DOM element directly — AdvancedMarkerElement's
      // own click listener requires gmpClickable + gmp-click event which is
      // less reliable. stopPropagation prevents the underlying map click.
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        focusHospital(h.id);
      });
      el.addEventListener("mouseenter", () => setHoverId(h.id));
      el.addEventListener("mouseleave", () => setHoverId(null));
      markersRef.current.push({ marker, el });
    });
  }, [pins, ready]);

  // Active/hover styling via class toggles on the marker DOM elements.
  useEffect(() => {
    if (!ready) return;
    pins.forEach((h, i) => {
      const entry = markersRef.current[i];
      if (!entry) return;
      entry.el.classList.toggle("is-active", h.id === activeId);
      entry.el.classList.toggle("is-hover", h.id === hoverId && h.id !== activeId);
      entry.marker.zIndex = h.id === activeId ? 1000 : h.id === hoverId ? 500 : undefined;
    });
  }, [activeId, hoverId, ready, pins]);

  // Idle return to overview after inactivity
  useEffect(() => {
    clearIdleTimer();
    if (!activeId || !mapRef.current) return;

    const map = mapRef.current;
    const reset = () => {
      clearIdleTimer();
      idleTimerRef.current = window.setTimeout(() => {
        if (activeIdRef.current) goOverview();
      }, IDLE_RETURN_MS);
    };
    reset();
    const dragListener = map.addListener("dragstart", reset);
    const zoomListener = map.addListener("zoom_changed", reset);
    return () => {
      clearIdleTimer();
      dragListener.remove();
      zoomListener.remove();
    };
  }, [activeId]);

  // Realtime: subscribe to CRM hospital + shift changes so pins and the live
  // shift count update without a page reload.
  useEffect(() => {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return;

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const refetchHospitals = async () => {
      const { data, error } = await supabase
        .from("hospitals")
        .select("id, name, type, latitude, longitude, logo_url, website")
        .eq("status", "active")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .not("name", "ilike", "%trial%")
        .not("name", "ilike", "%test%")
        .not("name", "ilike", "%statdoctor%");
      if (error || !data) return;
      setCrmHospitals(
        data.filter(
          (h): h is MapHospital =>
            typeof h.latitude === "number" && typeof h.longitude === "number",
        ),
      );
    };

    const refetchShiftCounts = async () => {
      const { data, error } = await supabase
        .from("shifts")
        .select("hospital_name")
        .eq("status", "Active");
      if (error || !data) return;
      const counts: Record<string, number> = {};
      for (const s of data) {
        const name = (s as { hospital_name?: string | null }).hospital_name;
        if (!name) continue;
        const key = normaliseHospitalKey(name);
        counts[key] = (counts[key] ?? 0) + 1;
      }
      setShiftCounts(counts);
    };

    const channel = supabase
      .channel("map-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "hospitals" }, refetchHospitals)
      .on("postgres_changes", { event: "*", schema: "public", table: "shifts" }, refetchShiftCounts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const focusPin = (hoverId ? pins.find((p) => p.id === hoverId) : null) ?? (activeId ? pins.find((p) => p.id === activeId) : null);
  const keyMissing = !KEY;
  const partnerCount = pins.length;

  return (
    <section ref={sectionRef} className="relative bg-white pt-24 md:pt-28 pb-6 md:pb-10 px-4 md:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[15%] -translate-x-1/2 w-[92%] max-w-[1320px] h-[88%] rounded-[40px] blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 30%, rgba(50,50,255,0.20), transparent 70%), radial-gradient(50% 50% at 80% 70%, rgba(205,227,93,0.20), transparent 70%)",
        }}
      />

      <div className="relative max-w-[1320px] mx-auto">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-muted font-medium">
            Australia&apos;s locum doctor marketplace
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-muted">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-electric opacity-75 animate-ping-slow" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric" />
            </span>
            Live · {partnerCount} hospitals
          </div>
        </div>

        <div className="relative rounded-[24px] md:rounded-[28px] border border-ink/15 bg-white overflow-hidden shadow-[0_30px_90px_-40px_rgba(26,26,46,0.25)]">
          <div
            ref={mapContainer}
            className="relative w-full h-[64vh] min-h-[480px] md:h-[72vh] md:min-h-[600px]"
          />

          {keyMissing && (
            <div className="absolute inset-0 grid place-items-center bg-bone">
              <div className="text-center max-w-md px-6">
                <div className="text-[10px] tracking-[0.22em] uppercase text-muted mb-2">Map disabled</div>
                <p className="text-sm text-muted">
                  Add <code className="px-1.5 py-0.5 rounded bg-white border border-ink/15">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to <code className="px-1.5 py-0.5 rounded bg-white border border-ink/15">.env.local</code> and restart.
                </p>
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {focusPin && (
              <motion.div
                key={focusPin.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute top-4 right-4 md:top-5 md:right-5 z-10 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-ink/10 shadow-lg max-w-[88vw]"
              >
                <span className="w-2 h-2 rounded-full bg-electric shrink-0" />
                <div className="text-[13px] md:text-[14px] truncate leading-tight">
                  <span className="font-semibold">{focusPin.name}</span>
                  <span className="text-muted text-[11px] md:text-[12px]">
                    {" · "}
                    {focusPin.liveShifts > 0
                      ? `${focusPin.liveShifts >= 10 ? "10+" : focusPin.liveShifts} live shift${focusPin.liveShifts === 1 ? "" : "s"}`
                      : "No live shifts"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            style={{ pointerEvents: ready ? "auto" : "none" }}
            className="absolute left-4 right-4 bottom-4 md:left-5 md:right-auto md:bottom-5 z-10 max-w-md md:w-[400px] p-5 rounded-2xl bg-white/92 backdrop-blur-xl border border-ink/12 shadow-[0_30px_70px_-20px_rgba(26,26,46,0.25)]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {activeId && focusPin ? (
                <HospitalCTA key={`cta-${focusPin.id}`} pin={focusPin} />
              ) : (
                <HeroCTA key="hero" partnerCount={partnerCount} ready={ready} />
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence>
            {activeId && (
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                onClick={goOverview}
                className="absolute top-4 left-4 md:top-5 md:left-5 z-20 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-ink text-white text-xs md:text-sm font-semibold shadow-lg hover:bg-ocean transition-colors"
                data-hover
              >
                <span aria-hidden>←</span>
                Back to Australia
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-between px-1 text-[10px] tracking-[0.22em] uppercase text-muted">
          <span>
            {activeId
              ? `Drag back or hit ← to see all ${partnerCount} hospitals`
              : "Click any pin to see our hospital"}
          </span>
          <span className="hidden md:inline">Hover for details</span>
        </div>
      </div>

      <style jsx global>{`
        .sd-marker {
          --sd-state-scale: 1;
          display: grid;
          place-items: center;
          background: #fff;
          border-radius: 999px;
          border: 2px solid #1a1a2e;
          box-shadow: 0 4px 10px rgba(26, 26, 46, 0.25);
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.18s ease;
          transform-origin: center;
          will-change: transform;
          /* Zoom-driven scale set by JS on the map container */
          transform: scale(calc(var(--sd-marker-scale, 1) * var(--sd-state-scale)));
        }
        .sd-marker--dot {
          width: 12px;
          height: 12px;
        }
        .sd-marker--logo {
          width: 44px;
          height: 44px;
          padding: 0;
          overflow: hidden;
        }
        .sd-marker--logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          border-radius: 999px;
        }
        .sd-marker.is-hover {
          --sd-state-scale: 1.15;
          box-shadow: 0 6px 16px rgba(26, 26, 46, 0.35);
        }
        .sd-marker.is-active {
          --sd-state-scale: 1.4;
          border-width: 3px;
          box-shadow: 0 0 0 4px rgba(50, 50, 255, 0.18), 0 8px 22px rgba(26, 26, 46, 0.4);
        }
      `}</style>
    </section>
  );
}

// App store URLs (kept in sync with the FinalCTA section in HomeClient).
const APP_STORE_URL = "https://apps.apple.com/au/app/statdoctor/id6452677138";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=user.statdoctor.app&hl=en_AU";

function useDownloadUrl(): string {
  const [url, setUrl] = useState(APP_STORE_URL);
  useEffect(() => {
    if (typeof navigator !== "undefined" && /android/i.test(navigator.userAgent)) {
      setUrl(PLAY_STORE_URL);
    }
  }, []);
  return url;
}

function HeroCTA({ partnerCount, ready }: { partnerCount: number; ready: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <h1 className="display text-[clamp(20px,2.5vw,30px)] leading-[1.05]">
        Shifts that pay you fully.{" "}
        <span className="italic text-ocean">No agency in the middle.</span>
      </h1>

      <div className="mt-4 flex items-center gap-3 sm:gap-4 text-[10px] tracking-[0.18em] uppercase">
        <Stat to={partnerCount} label="Hospitals" play={ready} />
        <span className="w-px h-6 bg-ink/15 shrink-0" />
        <Stat to={400} suffix="+" label="Doctors" play={ready} />
        <span className="w-px h-6 bg-ink/15 shrink-0" />
        <Stat to={500} prefix="$" smallPrefix="Up to" label="Per shift" play={ready} />
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <a
          href="/for-doctors"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-ocean text-white text-xs md:text-sm font-semibold hover:bg-ink transition-colors"
          data-hover
        >
          Join as a doctor
          <span aria-hidden>→</span>
        </a>
        <a
          href="/hospitals"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-ink/20 text-ink text-xs md:text-sm font-medium hover:bg-bone hover:border-ink transition-colors"
          data-hover
        >
          Join as a hospital
          <span aria-hidden>→</span>
        </a>
      </div>
    </motion.div>
  );
}

function HospitalCTA({ pin }: { pin: Pin }) {
  const downloadUrl = useDownloadUrl();
  const shiftLabel =
    pin.liveShifts > 0
      ? `${pin.liveShifts >= 10 ? "10+" : pin.liveShifts} live shift${pin.liveShifts === 1 ? "" : "s"} available now`
      : "Live shifts posted regularly";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="flex items-center gap-3">
        {pin.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pin.logoUrl}
            alt=""
            className="w-11 h-11 rounded-full object-cover ring-2 ring-ink/15 shrink-0"
          />
        )}
        <div className="min-w-0">
          <div className="text-[10px] tracking-[0.22em] uppercase text-muted">Want to view shifts at</div>
          {pin.website ? (
            <a
              href={pin.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[15px] md:text-[16px] leading-tight truncate text-ink hover:text-ocean underline-offset-2 hover:underline transition-colors block"
              data-hover
            >
              {pin.name}?
            </a>
          ) : (
            <div className="font-semibold text-[15px] md:text-[16px] leading-tight truncate">{pin.name}?</div>
          )}
        </div>
      </div>

      <div className="mt-3 inline-flex items-center gap-2 text-[11px] md:text-[12px] text-ink/80">
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-electric opacity-75 animate-ping-slow" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric" />
        </span>
        {shiftLabel}
      </div>

      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-ocean text-white text-sm font-semibold hover:bg-ink transition-colors"
        data-hover
      >
        Download StatDoctor
        <span aria-hidden>→</span>
      </a>
      <p className="mt-2 text-[10px] text-muted text-center">
        Free · iOS &amp; Android · Verified by AHPRA
      </p>
    </motion.div>
  );
}

function Stat({
  to,
  prefix = "",
  suffix = "",
  smallPrefix,
  label,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  smallPrefix?: string;
  label: string;
  // `play` is no longer wired up — the map CTA card now renders these
  // numbers statically rather than counting up from zero.
  play?: boolean;
}) {
  return (
    <div>
      <div className="display text-lg sm:text-xl md:text-2xl normal-case tracking-tight leading-none inline-flex items-baseline gap-1 whitespace-nowrap">
        {smallPrefix && (
          <span className="text-ink mr-1">
            {smallPrefix}
          </span>
        )}
        <span className="tabular-nums">
          {prefix}
          {to.toLocaleString("en-AU")}
          {suffix}
        </span>
      </div>
      <div className="mt-1 text-[9px] text-muted">{label}</div>
    </div>
  );
}
