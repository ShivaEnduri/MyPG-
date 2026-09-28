
export const BASE = "/base" as const;

export const RENTALS_BASE = `${BASE}/rentals` as const;
export const STUDIO_BASE = `${BASE}/studio` as const;
export const PG_BASE = `${BASE}/pg` as const;
export const ADMIN_BASE = `${RENTALS_BASE}/admin` as const;
export const RM_BASE = `${RENTALS_BASE}/rm` as const;
export const FM_BASE = `${RENTALS_BASE}/fm` as const;

export const ENQUIRIES_PATH = `${BASE}/enquiries` as const;
export const FOOTER_PATH = `${BASE}/footer` as const;

export const STUDIO_ADMIN_BASE = `${STUDIO_BASE}/admin` as const;
export const STUDIO_VENDOR_BASE = `${STUDIO_BASE}/vendor` as const;
// Relative paths — ONLY for use INSIDE StudioApp
export const STUDIO_ADMIN_BASE_RELATIVE = "admin" as const;
export const STUDIO_VENDOR_BASE_RELATIVE = "vendor" as const;