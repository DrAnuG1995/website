import HospitalsClient from "./HospitalsClient";
import { fetchActiveHospitals, fetchLiveStats } from "@/lib/hospitals";

export const metadata = { title: "For Hospitals, StatDoctor" };

// Re-fetch on every render so the hero stats reflect the same CRM state
// as the homepage map and /for-doctors network grid. The marketing site
// must never 500 on a CRM hiccup — fetchActiveHospitals/fetchLiveStats
// both swallow errors and return safe defaults.
export const revalidate = 0;

export default async function Page() {
  const [hospitals, liveStats] = await Promise.all([
    fetchActiveHospitals(),
    fetchLiveStats(),
  ]);
  return (
    <HospitalsClient
      partnerCount={hospitals.length}
      activeShifts={liveStats.activeShifts}
    />
  );
}
