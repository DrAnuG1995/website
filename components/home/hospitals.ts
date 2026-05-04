// Hardcoded coordinates so we never call the Mapbox geocoding API (free tier preservation).
// State / region / lat-lng curated by hand from public locality data.
// If a hospital relocates, edit this file directly.

export type Hospital = {
  name: string;
  state: "VIC" | "NSW" | "QLD" | "WA" | "TAS" | "ACT" | "SA" | "NT";
  type: string;
  lng: number;
  lat: number;
  /** Click-to-dive zoom override. Defaults to 16 (city tertiary). Lower for
   *  regional/small-town sites where building-level zoom shows nothing. */
  zoom?: number;
  /** Hospital brand logo rendered inside the white map pin. If absent, the
   *  marker falls back to the StatDoctor mark. URLs are typically the same
   *  CDN-hosted partner logos used in the homepage logo strip. */
  logoUrl?: string;
};

// Zoom presets:
//   16  , major city / tertiary hospital, building visible at this scale
//   14  , large regional town, shows the precinct + surrounding streets
//   12.5, small regional town, shows the whole town footprint
const Z_REGIONAL_TOWN = 14;
const Z_SMALL_TOWN = 12.5;

export const HOSPITALS: Hospital[] = [
  { name: "Alexandra District Health",                     state: "VIC", type: "Emergency",        lng: 145.7167, lat: -37.1952, zoom: Z_SMALL_TOWN },
  { name: "Bairnsdale Regional Health Service",            state: "VIC", type: "Regional",         lng: 147.6079, lat: -37.8314, zoom: Z_REGIONAL_TOWN, logoUrl: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697c24083cb29d7af761cd8f_brhs.png" },
  { name: "Bendigo & District Aboriginal Co-operative",    state: "VIC", type: "GP",               lng: 144.2786, lat: -36.7287 },
  { name: "Bendigo Health",                                state: "VIC", type: "Regional",         lng: 144.2811, lat: -36.7491 },
  { name: "Biggenden Multipurpose Health Centre",          state: "QLD", type: "Emergency",        lng: 152.0510, lat: -25.5063, zoom: Z_SMALL_TOWN },
  { name: "Border Urgent Care Centre",                     state: "NSW", type: "GP",               lng: 146.8867, lat: -36.1212 },
  { name: "Bundaberg Hospital",                            state: "QLD", type: "Regional",         lng: 152.3358, lat: -24.8688 },
  { name: "CBD Doctors Melbourne",                         state: "VIC", type: "GP",               lng: 144.9631, lat: -37.8136 },
  { name: "Central West Medical Centre",                   state: "NSW", type: "GP",               lng: 149.5775, lat: -33.4194, zoom: Z_REGIONAL_TOWN },
  { name: "Childers Hospital",                             state: "QLD", type: "Emergency",        lng: 152.2732, lat: -25.2395, zoom: Z_SMALL_TOWN },
  { name: "Colac Area Health",                             state: "VIC", type: "Regional",         lng: 143.5828, lat: -38.3413, zoom: Z_REGIONAL_TOWN },
  { name: "Echuca Regional Health",                        state: "VIC", type: "Regional",         lng: 144.7476, lat: -36.1384, zoom: Z_REGIONAL_TOWN },
  { name: "Eidsvold Multipurpose Health Service",          state: "QLD", type: "Emergency",        lng: 151.1259, lat: -25.3825, zoom: Z_SMALL_TOWN },
  { name: "Knox Private Hospital ED",                      state: "VIC", type: "Emergency",        lng: 145.2278, lat: -37.8495 },
  { name: "Fisher Family Practice",                        state: "QLD", type: "Emergency",        lng: 153.0251, lat: -27.4698 },
  { name: "Gayndah Hospital",                              state: "QLD", type: "Emergency",        lng: 151.6044, lat: -25.6313, zoom: Z_SMALL_TOWN },
  { name: "Gin Gin Hospital",                              state: "QLD", type: "Regional",         lng: 151.9534, lat: -24.9860, zoom: Z_SMALL_TOWN },
  { name: "GN Medical Centre",                             state: "NSW", type: "GP",               lng: 150.9300, lat: -33.8750 },
  { name: "HEAL Urgent Care Newcastle",                    state: "NSW", type: "Emergency",        lng: 151.7817, lat: -32.9283 },
  { name: "Hervey Bay Hospital",                           state: "QLD", type: "Regional",         lng: 152.8209, lat: -25.2988 },
  { name: "Hobart Private Hospital",                       state: "TAS", type: "Emergency",        lng: 147.3298, lat: -42.8807 },
  { name: "Holder Family Practice",                        state: "ACT", type: "GP",               lng: 149.0533, lat: -35.3375 },
  { name: "Hollywood Private Hospital",                    state: "WA",  type: "Emergency",        lng: 115.8095, lat: -31.9689 },
  { name: "Kalgoorlie Hospital",                           state: "WA",  type: "Regional",         lng: 121.4705, lat: -30.7409, zoom: Z_REGIONAL_TOWN },
  { name: "Kingston Plaza Medical Centre",                 state: "ACT", type: "GP",               lng: 149.1432, lat: -35.3168 },
  // Kutjungka Regional Clinic is run by KAMS (Kimberley Aboriginal Medical Services).
  // Primary site = Balgo Clinic, Wirri Street, Balgo (Wirrimanu), East Kimberley.
  { name: "Kutjungka Regional Clinic",                     state: "WA",  type: "GP",               lng: 127.9828, lat: -20.1416, zoom: Z_REGIONAL_TOWN },
  { name: "Maryborough Hospital",                          state: "QLD", type: "Regional",         lng: 152.6906, lat: -25.5218 },
  { name: "Mater Private Brisbane",                        state: "QLD", type: "Emergency",        lng: 153.0288, lat: -27.4843 },
  { name: "Mater Private Mackay",                          state: "QLD", type: "Emergency",        lng: 149.1662, lat: -21.1310 },
  { name: "Mater Private Rockhampton",                     state: "QLD", type: "Emergency",        lng: 150.4978, lat: -23.3980 },
  { name: "Mater Private Townsville",                      state: "QLD", type: "Emergency",        lng: 146.7872, lat: -19.2887 },
  { name: "Mercy Family Doctors",                          state: "VIC", type: "GP",               lng: 144.9650, lat: -37.7800 },
  { name: "Merri-bek Family Doctors",                      state: "VIC", type: "GP",               lng: 144.9455, lat: -37.7542 },
  { name: "Monto Hospital",                                state: "QLD", type: "Emergency",        lng: 151.1252, lat: -24.8654, zoom: Z_SMALL_TOWN },
  { name: "MyFast Medical",                                state: "NSW", type: "Emergency",        lng: 151.2100, lat: -33.8700, logoUrl: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697c31849389b03bf00674df_Myfast%20medical%20Logo.png" },
  { name: "Noosa Private Hospital",                        state: "QLD", type: "Emergency",        lng: 153.0457, lat: -26.4026 },
  { name: "Paraburdoo Medical Centre",                     state: "WA",  type: "Emergency",        lng: 117.6708, lat: -23.2032, zoom: Z_REGIONAL_TOWN },
  { name: "Portland District Health",                      state: "VIC", type: "Emergency",        lng: 141.6063, lat: -38.3414, zoom: Z_REGIONAL_TOWN },
  { name: "Saint Lukes Medical Centre",                    state: "NSW", type: "GP",               lng: 151.2246, lat: -33.8738 },
  { name: "Swan Hill District Health",                     state: "VIC", type: "Regional",         lng: 143.5563, lat: -35.3406, zoom: Z_REGIONAL_TOWN },
  { name: "Friendly Society Private, Bundaberg",          state: "QLD", type: "Emergency",        lng: 152.3425, lat: -24.8708 },
  { name: "Tom Price Hospital",                            state: "WA",  type: "Emergency",        lng: 117.7899, lat: -22.6958, zoom: Z_REGIONAL_TOWN },
  { name: "Woodburn Health GP Clinic",                     state: "NSW", type: "GP",               lng: 153.3333, lat: -29.0667, zoom: Z_SMALL_TOWN },
  { name: "Yarrawonga Health",                             state: "VIC", type: "Regional",         lng: 146.0042, lat: -36.0102, zoom: Z_REGIONAL_TOWN },
];

// Curated subset of 12 stops for the auto-tour, geographically + categorically diverse.
// All 44 still render on the map; this just defines what the camera flies to in sequence.
export const TOUR_INDICES: number[] = [
  3,  // Bendigo Health (VIC regional)
  7,  // CBD Doctors Melbourne (VIC metro GP)
  11, // Echuca Regional Health (VIC regional)
  1,  // Bairnsdale Regional Health (VIC east)
  6,  // Bundaberg Hospital (QLD coast)
  30, // Mater Private Townsville (QLD north)
  19, // Hervey Bay Hospital (QLD)
  18, // HEAL Newcastle (NSW)
  34, // MyFast Medical (NSW Sydney)
  20, // Hobart Private Hospital (TAS)
  22, // Hollywood Private Hospital (WA Perth)
  23, // Kalgoorlie Hospital (WA outback)
];
