// ── WPN site data ──────────────────────────────────────────────
// All [PLACEHOLDER] values — swap with real content when ready.

export const site = {
  name: "Wassa Professionals Network",
  short: "WPN",
  mantra: "Help a Wassa to Help Wassa",
  email: "admin@wassaprosnetwork.org",
  phones: [
    "055 196 7556",
    "055 198 3187",
    "055 199 9406",
    "055 196 0192",
  ],
  address: {
    line1: "P.O. Box 71412, Accra GA/R, Greater Accra",
    line2: "House No. 714/2, 18th Lane, Osu, Accra",
    digitalAddress: "GR-056-9285",
  },
  socials: [
    { label: "X", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "LinkedIn", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "TikTok", href: "#" },
  ],
};

// Fee structure — set by the General Assembly. Public pages show the live
// amounts from admin Settings (lib/fees.ts); these are only the fallback for
// when the API can't be reached, so keep them in step with Settings.
export const fees = {
  currency: "GH₵",
  registration: 100, // one-time, on admission
  dues: 300, // per quarter
  duesPerYear: 1200, // 300 × 4 quarters
};

// `accent` marks a call-to-action tab — rendered as an outlined pill in the
// header so it reads as an invitation rather than just another section link.
export type NavItem = {
  label: string;
  href?: string;
  accent?: boolean;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Who We Are",
    children: [
      { label: "About WPN", href: "/about" },
      { label: "Executives", href: "/executives" },
      { label: "Committees", href: "/committees" },
    ],
  },
  {
    label: "What We Do",
    children: [
      { label: "Projects", href: "/projects" },
      { label: "Project Gallery", href: "/projects#gallery" },
    ],
  },
  {
    label: "Events",
    children: [
      { label: "News", href: "/events#news" },
      { label: "Events Gallery", href: "/events#gallery" },
    ],
  },
  {
    label: "Membership",
    children: [
      { label: "Requirements", href: "/membership" },
      { label: "Apply for Membership", href: "/membership/apply" },
      { label: "Continue an Application", href: "/membership/continue" },
      { label: "Dues Payment", href: "/dashboard/dues" },
    ],
  },
  { label: "Contribute", href: "/contribute", accent: true },
  { label: "Contact", href: "/contact" },
];
