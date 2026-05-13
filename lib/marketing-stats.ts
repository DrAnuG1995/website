// Headline marketing stats surfaced across the public site. Keep these
// numbers in one place so they don't drift between the homepage,
// /hospitals, /for-doctors and partner pitches. Update here and every
// page picks up the new value on the next request.
//
// These are claim-style numbers (vs. live CRM counts) — bump them when
// ops confirms a new threshold has been crossed.

// Verified Australian doctors on platform. Hospital-facing metric used
// on /hospitals; not shown on /for-doctors (doctors don't need to be
// reminded how many doctors are on it).
export const VERIFIED_DOCTORS = 400;

// Total agency fees saved by partner hospitals since platform launch.
// Used as the headline value-prop counter on /hospitals.
export const AGENCY_FEES_SAVED_AUD = 200_000;
