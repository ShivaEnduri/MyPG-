// packages/ui/src/components/AuthModal/footerSections.ts

export interface FooterSection {
  id: string;
  label: string;
}

const COMMON_ITEMS: FooterSection[] = [
  { id: "about-us", label: "About Us" },
  { id: "terms-and-conditions", label: "T&C's" },
  { id: "team", label: "Team" },
  { id: "contact-us", label: "Contact Us" },
];

const RENTALS_ONLY: FooterSection[] = [
  { id: "rr-package", label: "RR Package" },
  { id: "tenants", label: "Tenants" },
  { id: "owners", label: "Owners" },
];

/**
 * Get footer menu items based on current app
 * @param app - "rentals" | "studio" | "mypg" (defaults to rentals)
 * @returns Array of footer sections
 */
export const getFooterSections = (app: string = "rentals"): FooterSection[] => {
  if (app === "studio" || app === "mypg") {
    return COMMON_ITEMS;
  }
  return [...COMMON_ITEMS, ...RENTALS_ONLY]; // rentals (default)
};