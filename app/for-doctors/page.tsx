import ForDoctorsClient from "./ForDoctorsClient";
import { fetchActiveHospitals } from "@/lib/hospitals";

export const metadata = {
  title: "For doctors, StatDoctor",
  description:
    "Built for the way doctors actually work, calendar, verification, notifications, and shifts that pay you fully.",
};

// Re-fetch on every request so the partner count stays in lock-step with
// the homepage hero — when ops adds a new hospital in the admin portal
// the next page view picks it up.
export const revalidate = 0;

export default async function Page() {
  const hospitals = await fetchActiveHospitals();
  return <ForDoctorsClient partnerCount={hospitals.length} />;
}
