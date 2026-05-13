import type { CitySlide } from "@/components/CitySlideshow";

// Shared list of city photos cycled in the hero background on both
// /for-doctors and /hospitals. Photos live in public/hospitals/ —
// drop a new file there and append a frame here. Order is alphabetical
// so the cycle feels predictable. State labels are best-effort and
// appear as a small uppercase pill in the corner caption.
export const HERO_CITY_SLIDES: CitySlide[] = [
  { src: "/hospitals/bendigo.jpg",    alt: "Bendigo, Victoria",                             town: "Bendigo",    state: "VIC" },
  { src: "/hospitals/brisbane.jpg",   alt: "Brisbane river city, Queensland",               town: "Brisbane",   state: "QLD" },
  { src: "/hospitals/bundaberg.jpg",  alt: "Bundaberg, Queensland",                         town: "Bundaberg",  state: "QLD" },
  { src: "/hospitals/cairns.jpg",     alt: "Tropical Far North Queensland coast, Cairns",   town: "Cairns",     state: "QLD" },
  { src: "/hospitals/esperance.jpg",  alt: "White sand and turquoise water at Esperance",   town: "Esperance",  state: "WA"  },
  { src: "/hospitals/gold-coast.jpg", alt: "Gold Coast skyline and beaches, Queensland",    town: "Gold Coast", state: "QLD" },
  { src: "/hospitals/hervey-bay.jpg", alt: "Calm Fraser Coast waters near Hervey Bay",      town: "Hervey Bay", state: "QLD" },
  { src: "/hospitals/hobart.jpg",     alt: "Mountains above Hobart, Tasmania",              town: "Hobart",     state: "TAS" },
  { src: "/hospitals/kalgoorlie.jpg", alt: "Red-earth outback of the WA Goldfields",        town: "Kalgoorlie", state: "WA"  },
  { src: "/hospitals/mackay.jpg",     alt: "Tropical North Queensland coastline at Mackay", town: "Mackay",     state: "QLD" },
  { src: "/hospitals/melbourne.jpg",  alt: "Melbourne cityscape, Victoria",                 town: "Melbourne",  state: "VIC" },
  { src: "/hospitals/noosa.jpg",      alt: "Noosa Heads surf beach, Sunshine Coast",        town: "Noosa",      state: "QLD" },
  { src: "/hospitals/parabudoo.jpg",  alt: "Pilbara landscape near Paraburdoo",             town: "Paraburdoo", state: "WA"  },
  { src: "/hospitals/perth.jpg",      alt: "Perth, Western Australia",                      town: "Perth",      state: "WA"  },
  { src: "/hospitals/sydney.jpg",     alt: "Sydney harbour, New South Wales",               town: "Sydney",     state: "NSW" },
  { src: "/hospitals/tom-price.jpg",  alt: "Red-dirt road through the Pilbara",             town: "Tom Price",  state: "WA"  },
  { src: "/hospitals/townsville.jpg", alt: "Townsville, North Queensland coast",            town: "Townsville", state: "QLD" },
];
