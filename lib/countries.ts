import { getCountries, getCountryCallingCode, CountryCode } from "libphonenumber-js";

export interface Country {
  dialCode: string; // Calling code (e.g., '1', '60', '91')
  name: string; // Country name
  flag: string; // Country flag emoji
  code: CountryCode; // ISO country code for internal use only
}

// Country code to emoji flag conversion
function countryCodeToFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

// Country code to name mapping
const countryNames: Record<string, string> = {
  US: "United States",
  MY: "Malaysia",
  GB: "United Kingdom",
  SG: "Singapore",
  IN: "India",
  PH: "Philippines",
  PT: "Portugal",
  GH: "Ghana",
  NG: "Nigeria",
  BE: "Belgium",
  CA: "Canada",
  AU: "Australia",
  CN: "China",
  JP: "Japan",
  KR: "South Korea",
  TH: "Thailand",
  ID: "Indonesia",
  VN: "Vietnam",
  PK: "Pakistan",
  BD: "Bangladesh",
  TR: "Turkey",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  EG: "Egypt",
  ZA: "South Africa",
  KE: "Kenya",
  BR: "Brazil",
  MX: "Mexico",
  AR: "Argentina",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  PL: "Poland",
  RU: "Russia",
  NZ: "New Zealand",
};

// Get all available countries with their dial codes
export function getAllCountries(): Country[] {
  const countryCodes = getCountries();
  const countries: Country[] = [];

  for (const code of countryCodes) {
    try {
      const dialCode = getCountryCallingCode(code);
      countries.push({
        dialCode,
        name: countryNames[code] || code,
        flag: countryCodeToFlag(code),
        code, // Keep for internal use with libphonenumber-js
      });
    } catch {
      // Skip countries that don't have calling codes
      continue;
    }
  }

  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

// Get countries with Malaysia first, then alphabetical
export function getCountriesWithMalaysiaFirst(): Country[] {
  const allCountries = getAllCountries();
  const malaysia = allCountries.find((c) => c.dialCode === "60");
  const others = allCountries.filter((c) => c.dialCode !== "60");

  return malaysia ? [malaysia, ...others] : others;
}
