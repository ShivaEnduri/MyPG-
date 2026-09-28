// packages/services/roleCatalogService.ts
import { fetchRoleCatalogApi, RoleCatalogEntry } from "@/app/shared/services/api/commonApiServices";

let inMemoryCache: RoleCatalogEntry[] | null = null;
let inFlightRequest: Promise<RoleCatalogEntry[]> | null = null;

async function fetchWithRetry(retries = 2, delayMs = 500): Promise<RoleCatalogEntry[]> {
  try {
    return await fetchRoleCatalogApi();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return fetchWithRetry(retries - 1, delayMs * 2);
  }
}

/**
 * Returns the role catalog for the lifetime of this browser tab/session.
 * Backend (Redis) is the source of truth for freshness — this layer only
 * exists to dedupe concurrent calls and avoid refetching on every mount.
 * A hard page refresh clears this and fetches fresh data, which is fine
 * given Redis serves it fast and roles change infrequently.
 */
export async function getRoleCatalog(): Promise<RoleCatalogEntry[]> {
  if (inMemoryCache) return inMemoryCache;
  if (inFlightRequest) return inFlightRequest;

  inFlightRequest = fetchWithRetry()
    .then((data) => {
      inMemoryCache = data;
      return data;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
}

/** Force a fresh fetch — call this if you suspect roles changed server-side mid-session. */
export async function refreshRoleCatalog(): Promise<RoleCatalogEntry[]> {
  inMemoryCache = null;
  return getRoleCatalog();
}

export function getRoleByIdFromCatalog(
  catalog: RoleCatalogEntry[],
  roleId: number | null | undefined
): RoleCatalogEntry | null {
  if (roleId === null || roleId === undefined) return null;
  return catalog.find((r) => r.id === roleId) ?? null;
}

// export function getAppIdByName(
//   catalog: RoleCatalogEntry[],
//   appName: string
// ): number | null {
//   const match = catalog.find((r) => r.app_name === appName);
//   return match?.app_id ?? null;
// }