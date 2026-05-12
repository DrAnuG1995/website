import ForDoctorsClient from "./ForDoctorsClient";
import { fetchActiveHospitals, normaliseHospitalKey } from "@/lib/hospitals";

export const metadata = {
  title: "For doctors, StatDoctor",
  description:
    "Built for the way doctors actually work, calendar, verification, notifications, and shifts that pay you fully.",
};

// Re-fetch on every request so the partner count and website links stay
// in lock-step with the homepage hero — when ops adds a new hospital (or
// changes its website) in the admin portal, the next page view picks it
// up.
export const revalidate = 0;

export default async function Page() {
  const hospitals = await fetchActiveHospitals();

  // Build a normalised name → website map so the client can click-link
  // any partner card whose CRM row has a website URL. Names go through
  // the same normaliser the live feed uses (lowercase, single-spaced)
  // so small whitespace/case mismatches between the hardcoded PARTNERS
  // list and the CRM still match.
  const websiteByName: Record<string, string> = {};
  for (const h of hospitals) {
    if (h.website) websiteByName[normaliseHospitalKey(h.name)] = h.website;
  }

  return (
    <ForDoctorsClient
      partnerCount={hospitals.length}
      websiteByName={websiteByName}
    />
  );
}
