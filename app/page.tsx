import HomeClient from "./HomeClient";
import {
  fetchActiveHospitals,
  fetchActiveShiftCounts,
  fetchLiveShifts,
  fetchLiveStats,
} from "@/lib/hospitals";

// Pull active hospital coordinates, shift counts, the live-shift feed, and
// aggregate CRM stats on every render. Static caching is intentionally off
// — when the admin portal posts a new shift, the next page view shows it.
export const revalidate = 0;

export default async function Page() {
  const [hospitals, shiftCounts, liveShifts, liveStats] = await Promise.all([
    fetchActiveHospitals(),
    fetchActiveShiftCounts(),
    fetchLiveShifts(5),
    fetchLiveStats(),
  ]);
  return (
    <HomeClient
      hospitals={hospitals}
      shiftCounts={shiftCounts}
      liveShifts={liveShifts}
      liveStats={liveStats}
    />
  );
}
