import ForDoctorsClient, { type LivePartner } from "./ForDoctorsClient";
import { deriveAuState, fetchActiveHospitals } from "@/lib/hospitals";

export const metadata = {
  title: "For doctors, StatDoctor",
  description:
    "Built for the way doctors actually work, calendar, verification, notifications, and shifts that pay you fully.",
};

// Re-fetch on every request so the partner count, the network grid, and
// each card's outbound link all stay in lock-step with the homepage —
// when ops adds a hospital (or edits its website / address) in the admin
// portal the next page view picks it up.
export const revalidate = 0;

export default async function Page() {
  const hospitals = await fetchActiveHospitals();

  // Project every CRM row into the grid. State is best-effort — derived
  // from formatted_address when present, otherwise null. Hospitals
  // without a derivable state still appear under "All states", they
  // just don't get bucketed under a specific state filter. Sort
  // alphabetically so the grid is stable.
  const partners: LivePartner[] = hospitals
    .map((h) => ({
      name: h.name,
      state: deriveAuState(h.formatted_address),
      website: h.website,
      logoUrl: h.logo_url,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ForDoctorsClient partnerCount={hospitals.length} partners={partners} />
  );
}
