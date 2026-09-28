// packages/utils/src/getCountries.ts
import axios from "axios";

export interface Country {
  name: string;
  iso: string;
  code: string;
  flag: string;
}

export async function getCountries(): Promise<Country[]> {
  try {
    const response = await axios.get<
      {
        name: { common: string };
        cca2: string;
        flags: { png: string };
        idd: { root: string; suffixes?: string[] };
      }[]
    >("https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd");

    return response.data
      .map((country) => {
        const root = country.idd?.root || "";
        const suffix = country.idd?.suffixes?.[0] || "";
        const code = root && suffix ? root + suffix : "";

        return {
          name: country.name.common,
          iso: country.cca2,
          code,
          flag: country.flags?.png || "",
        };
      })
      .filter((c) => c.code && c.iso) // Remove countries without calling codes
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}