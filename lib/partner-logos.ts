// Curated partner-logo marquee shared between the homepage and the
// /hospitals landing page so the two stay in lock-step. Heights are
// individually tuned so logos with different aspect ratios read at
// visually similar weight — wide wordmarks at the same height as
// square icons look enormous, and padded PNG icons look tiny. Heights
// were computed off h = sqrt(targetArea / aspect) with target area
// ≈ 51² = 2601, then nudged up for known-padded icons.

export type PartnerLogo = { src: string; h?: number };

export const PARTNER_LOGOS: PartnerLogo[] = [
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6b34e627a6c618835f_16.png", h: 60 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b90e4261c120b064cabc_Group%201799.svg", h: 40 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b2ca97d3296f92eecdb3_Group%201797.svg", h: 37 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6891b9bdc8ce83d0d774d6a0_Group%201795.svg", h: 54 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/6989187d91bc7a590978853b_Hospital%20Logos%20(100%20x%20100%20px).png", h: 60 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69891c60a412a0902b515580_3.png", h: 56 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69891c6022354c21182e964e_5.png", h: 56 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697c24083cb29d7af761cd8f_brhs.png", h: 36 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/697c31849389b03bf00674df_Myfast%20medical%20Logo.png", h: 52 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6bd66a38e7ecd9a248_17.png", h: 56 },
  { src: "https://cdn.prod.website-files.com/688db6d677516719c3925d01/69a79f6b8e767399e5f8ad70_4.png", h: 56 },
];
