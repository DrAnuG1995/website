import HospitalsClient, { type HospitalCard } from "./HospitalsClient";
import { deriveAuState, fetchActiveHospitals } from "@/lib/hospitals";
import { loadHospitalPhotoMap, pickHospitalPhoto } from "@/lib/hospital-photos";

export const metadata = { title: "For Hospitals, StatDoctor" };

// Re-fetch on every render so the hero stat + carousel reflect the same
// CRM state as the homepage map and /for-doctors network grid.
export const revalidate = 0;

export default async function Page() {
  const hospitals = await fetchActiveHospitals();
  // Build the slug → file map by scanning public/hospitals/ once per
  // request. Hospitals with a matching file get that file as their
  // splash photo; the rest fall back to logo_url from the CRM (and the
  // client renders a placeholder swatch if both are null).
  const photoMap = loadHospitalPhotoMap();
  const cards: HospitalCard[] = hospitals
    .map((h) => ({
      name: h.name,
      state: deriveAuState(h.formatted_address),
      photoUrl: pickHospitalPhoto(h.name, h.logo_url, photoMap),
      website: h.website,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <HospitalsClient
      partnerCount={hospitals.length}
      hospitalCards={cards}
    />
  );
}
