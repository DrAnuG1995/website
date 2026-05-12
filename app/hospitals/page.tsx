import HospitalsClient, { type HospitalCard } from "./HospitalsClient";
import {
  deriveAuState,
  deriveAuTown,
  fetchActiveHospitals,
} from "@/lib/hospitals";
import { loadHospitalPhotoMap, pickHospitalPhoto } from "@/lib/hospital-photos";

export const metadata = { title: "For Hospitals, StatDoctor" };

// Re-fetch on every render so the hero stat + carousel reflect the same
// CRM state as the homepage map and /for-doctors network grid.
export const revalidate = 0;

export default async function Page() {
  const hospitals = await fetchActiveHospitals();
  // Scan public/hospitals/ once per request. Photo lookup is by town
  // slug (one photo per city, shared across all hospitals in that
  // city), falling back to hospital-name slug, then logo_url.
  const photoMap = loadHospitalPhotoMap();
  const cards: HospitalCard[] = hospitals
    .map((h) => {
      const town = deriveAuTown(h.formatted_address);
      return {
        name: h.name,
        state: deriveAuState(h.formatted_address),
        photoUrl: pickHospitalPhoto(h.name, town, h.logo_url, photoMap),
        website: h.website,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <HospitalsClient partnerCount={hospitals.length} hospitalCards={cards} />
  );
}
