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
    line1: "P.O. Box [PLACEHOLDER], Western Region", // [PLACEHOLDER]
    line2: "[Street Address], Wassa", // [PLACEHOLDER]
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

// Fee structure — set by the General Assembly. Displayed to members/applicants.
export const fees = {
  currency: "GH₵",
  registration: 100, // one-time, on admission
  dues: 300, // per quarter
  duesPerYear: 1200, // 300 × 4 quarters
};

export const nav = [
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
      { label: "Projects", href: "#" },
      { label: "Project Gallery", href: "#" },
    ],
  },
  {
    label: "Events",
    children: [
      { label: "News", href: "#" },
      { label: "Events Gallery", href: "#" },
    ],
  },
  {
    label: "Membership",
    children: [
      { label: "Requirements", href: "/membership" },
      { label: "Apply for Membership", href: "/membership/apply" },
      { label: "Dues Payment", href: "/dashboard/dues" },
    ],
  },
  { label: "Contact", href: "/contact" },
];
