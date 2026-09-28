

export interface FooterItem {
  id: string;
  label: string;
}

export const COMMON_ITEMS: FooterItem[] = [
  { id: "about-us", label: "About Us" },
  { id: "terms-and-conditions", label: "T&C's" },
  { id: "team", label: "Team" },
  { id: "contact-us", label: "Contact Us" },
];

export const RENTALS_ONLY: FooterItem[] = [
  { id: "rr-package", label: "RR Package" },
  { id: "tenants", label: "Tenants" },
  { id: "owners", label: "Owners" },
];

/**
 * Returns footer items based on selected app
 */
export const getFooterSections = (app: "rentals" | "studio" | "pg"): FooterItem[] => {
  if (app === "studio") return COMMON_ITEMS;
  return [...COMMON_ITEMS, ...RENTALS_ONLY];
};
