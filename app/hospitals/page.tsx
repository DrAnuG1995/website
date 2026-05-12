import HospitalsClient from "./HospitalsClient";
import { fetchActiveHospitals } from "@/lib/hospitals";

export const metadata = { title: "For Hospitals, StatDoctor" };

// Re-fetch on every render so the hero stat reflects the same CRM state
// as the homepage map and /for-doctors network grid. fetchActiveHospitals
// swallows errors and returns [] so the page never 500s on a CRM hiccup.
export const revalidate = 0;

export default async function Page() {
  const hospitals = await fetchActiveHospitals();
  return <HospitalsClient partnerCount={hospitals.length} />;
}
