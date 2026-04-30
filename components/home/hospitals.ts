// Hardcoded coordinates so we never call the Mapbox geocoding API (free tier preservation).
// State / region / lat-lng curated by hand from public locality data.
// If a hospital relocates, edit this file directly.

export type Hospital = {
  name: string;
  state: "VIC" | "NSW" | "QLD" | "WA" | "TAS" | "ACT" | "SA" | "NT";
  type: string;
  lng: number;
  lat: number;
};

export const HOSPITALS: Hospital[] = [
  { name: "Alexandra District Health",                     state: "VIC", type: "Emergency",        lng: 145.7115, lat: -37.1907 },
  { name: "Bairnsdale Regional Health Service",            state: "VIC", type: "Regional",         lng: 147.6242, lat: -37.8228 },
  { name: "Bendigo & District Aboriginal Co-operative",    state: "VIC", type: "GP",               lng: 144.2700, lat: -36.7600 },
  { name: "Bendigo Health",                                state: "VIC", type: "Regional",         lng: 144.2820, lat: -36.7569 },
  { name: "Biggenden Multipurpose Health Centre",          state: "QLD", type: "Emergency",        lng: 152.0411, lat: -25.5083 },
  { name: "Border Urgent Care Centre",                     state: "NSW", type: "GP",               lng: 146.9135, lat: -36.0737 },
  { name: "Bundaberg Hospital",                            state: "QLD", type: "Regional",         lng: 152.3489, lat: -24.8661 },
  { name: "CBD Doctors Melbourne",                         state: "VIC", type: "GP",               lng: 144.9631, lat: -37.8136 },
  { name: "Central West Medical Centre",                   state: "NSW", type: "GP",               lng: 149.5775, lat: -33.4194 },
  { name: "Childers Hospital",                             state: "QLD", type: "Emergency",        lng: 152.2789, lat: -25.2367 },
  { name: "Colac Area Health",                             state: "VIC", type: "Regional",         lng: 143.5845, lat: -38.3398 },
  { name: "Echuca Regional Health",                        state: "VIC", type: "Regional",         lng: 144.7501, lat: -36.1316 },
  { name: "Eidsvold Multipurpose Health Service",          state: "QLD", type: "Emergency",        lng: 151.1230, lat: -25.3717 },
  { name: "Knox Private Hospital ED",                      state: "VIC", type: "Emergency",        lng: 145.2275, lat: -37.8569 },
  { name: "Fisher Family Practice",                        state: "QLD", type: "Emergency",        lng: 153.0251, lat: -27.4698 },
  { name: "Gayndah Hospital",                              state: "QLD", type: "Emergency",        lng: 151.6181, lat: -25.6228 },
  { name: "Gin Gin Hospital",                              state: "QLD", type: "Regional",         lng: 151.9531, lat: -24.9961 },
  { name: "GN Medical Centre",                             state: "NSW", type: "GP",               lng: 150.9300, lat: -33.8750 },
  { name: "HEAL Urgent Care Newcastle",                    state: "NSW", type: "Emergency",        lng: 151.7817, lat: -32.9283 },
  { name: "Hervey Bay Hospital",                           state: "QLD", type: "Regional",         lng: 152.8186, lat: -25.2882 },
  { name: "Hobart Private Hospital",                       state: "TAS", type: "Emergency",        lng: 147.3257, lat: -42.8826 },
  { name: "Holder Family Practice",                        state: "ACT", type: "GP",               lng: 149.0533, lat: -35.3375 },
  { name: "Hollywood Private Hospital",                    state: "WA",  type: "Emergency",        lng: 115.8069, lat: -31.9802 },
  { name: "Kalgoorlie Hospital",                           state: "WA",  type: "Regional",         lng: 121.4656, lat: -30.7494 },
  { name: "Kingston Plaza Medical Centre",                 state: "ACT", type: "GP",               lng: 149.1453, lat: -35.3167 },
  { name: "Kutjungka Regional Clinic",                     state: "WA",  type: "GP",               lng: 128.0000, lat: -19.5000 },
  { name: "Maryborough Hospital",                          state: "QLD", type: "Regional",         lng: 152.7008, lat: -25.5403 },
  { name: "Mater Private Brisbane",                        state: "QLD", type: "Emergency",        lng: 153.0250, lat: -27.4830 },
  { name: "Mater Private Mackay",                          state: "QLD", type: "Emergency",        lng: 149.1860, lat: -21.1440 },
  { name: "Mater Private Rockhampton",                     state: "QLD", type: "Emergency",        lng: 150.5117, lat: -23.3780 },
  { name: "Mater Private Townsville",                      state: "QLD", type: "Emergency",        lng: 146.8169, lat: -19.2589 },
  { name: "Mercy Family Doctors",                          state: "VIC", type: "GP",               lng: 144.9650, lat: -37.7800 },
  { name: "Merri-bek Family Doctors",                      state: "VIC", type: "GP",               lng: 144.9614, lat: -37.7672 },
  { name: "Monto Hospital",                                state: "QLD", type: "Emergency",        lng: 151.1170, lat: -24.8660 },
  { name: "MyFast Medical",                                state: "NSW", type: "Emergency",        lng: 151.2100, lat: -33.8700 },
  { name: "Noosa Private Hospital",                        state: "QLD", type: "Emergency",        lng: 153.0844, lat: -26.4136 },
  { name: "Paraburdoo Medical Centre",                     state: "WA",  type: "Emergency",        lng: 117.6708, lat: -23.2042 },
  { name: "Portland District Health",                      state: "VIC", type: "Emergency",        lng: 141.6042, lat: -38.3499 },
  { name: "Saint Lukes Medical Centre",                    state: "NSW", type: "GP",               lng: 151.2000, lat: -33.8500 },
  { name: "Swan Hill District Health",                     state: "VIC", type: "Regional",         lng: 143.5544, lat: -35.3414 },
  { name: "Friendly Society Private — Bundaberg",          state: "QLD", type: "Emergency",        lng: 152.3490, lat: -24.8660 },
  { name: "Tom Price Hospital",                            state: "WA",  type: "Emergency",        lng: 117.7937, lat: -22.6939 },
  { name: "Woodburn Health GP Clinic",                     state: "NSW", type: "GP",               lng: 153.3333, lat: -29.0667 },
  { name: "Yarrawonga Health",                             state: "VIC", type: "Regional",         lng: 146.0000, lat: -36.0167 },
];

// Curated subset of 12 stops for the auto-tour — geographically + categorically diverse.
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
