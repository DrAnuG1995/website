import HospitalsClient from "./HospitalsClient";
import { fetchActiveHospitals } from "@/lib/hospitals";

// Re-fetch on every render so the hero stat matches the same CRM state
// as the homepage map and /for-doctors network grid.
export const revalidate = 0;

export default async function Page() {
  const hospitals = await fetchActiveHospitals();
  return <HospitalsClient partnerCount={hospitals.length} />;
}
