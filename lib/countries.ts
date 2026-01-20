import { getCountries, getCountryCallingCode, CountryCode } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

// Register English locale
countries.registerLocale(en);

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

// Get all available countries with their dial codes
export function getAllCountries(): Country[] {
  const countryCodes = getCountries();
  const allCountries: Country[] = [];

  for (const code of countryCodes) {
    try {
      const dialCode = getCountryCallingCode(code);
      const name = countries.getName(code, "en") || code;
      
      allCountries.push({
        dialCode,
        name,
        flag: countryCodeToFlag(code),
        code, // Keep for internal use with libphonenumber-js
      });
    } catch {
      // Skip countries that don't have calling codes
      continue;
    }
  }

  return allCountries.sort((a, b) => a.name.localeCompare(b.name));
}

// Get countries with Malaysia first, then alphabetical
export function getCountriesWithMalaysiaFirst(): Country[] {
  const allCountries = getAllCountries();
  const malaysia = allCountries.find((c) => c.dialCode === "60");
  const others = allCountries.filter((c) => c.dialCode !== "60");

  return malaysia ? [malaysia, ...others] : others;
}
