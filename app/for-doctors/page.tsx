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

  // Project each CRM row into the shape the network grid needs. We drop
  // any hospital whose state we can't derive from formatted_address — it
  // would land under "Unknown" in the filter UI, which looks broken.
  // Sort alphabetically inside each state so the grid is stable.
  const partners: LivePartner[] = hospitals
    .map((h) => {
      const state = deriveAuState(h.formatted_address);
      if (!state) return null;
      return {
        name: h.name,
        state,
        website: h.website,
        logoUrl: h.logo_url,
      };
    })
    .filter((p): p is LivePartner => p !== null)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ForDoctorsClient partnerCount={hospitals.length} partners={partners} />
  );
}
