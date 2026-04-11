import { NextRequest, NextResponse } from "next/server";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import { verifySession } from "@/lib/session";
import { weatherCodeToDescription } from "@/lib/weather-codes";

countries.registerLocale(en);

/** Vercel — ISO 3166-1 alpha-2 from edge. */
const VERCEL_IP_COUNTRY = "x-vercel-ip-country";
/** Cloudflare — same semantics when proxied through CF. */
const CF_IP_COUNTRY = "cf-ipcountry";

const DEFAULT_FALLBACK_COUNTRY = "US";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = await verifySession(token);
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const alpha2 = request.headers.get(VERCEL_IP_COUNTRY)?.toUpperCase() || request.headers.get(CF_IP_COUNTRY)?.toUpperCase() || null;

  const searchName = (alpha2 && countries.getName(alpha2, "en")) || countries.getName(DEFAULT_FALLBACK_COUNTRY, "en") || "United States";

  try {
    const geoParams = new URLSearchParams({
      name: searchName,
      count: "1",
      language: "en",
      format: "json",
    });
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${geoParams}`);
    if (!geoRes.ok) {
      return NextResponse.json({ error: "Weather unavailable" }, { status: 502 });
    }
    const geoData = (await geoRes.json()) as {
      results?: { latitude: number; longitude: number }[];
    };
    const loc = geoData.results?.[0];
    if (loc == null) {
      return NextResponse.json({ error: "Weather unavailable" }, { status: 502 });
    }

    const forecastParams = new URLSearchParams({
      latitude: String(loc.latitude),
      longitude: String(loc.longitude),
      current: "temperature_2m,weather_code",
      temperature_unit: "celsius",
    });
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?${forecastParams}`);
    if (!weatherRes.ok) {
      return NextResponse.json({ error: "Weather unavailable" }, { status: 502 });
    }
    const data = (await weatherRes.json()) as {
      current: { temperature_2m: number; weather_code: number };
    };

    const temperature = Math.round(data.current.temperature_2m);
    const description = weatherCodeToDescription(data.current.weather_code);

    return NextResponse.json({
      temperature,
      description,
      country: alpha2,
    });
  } catch {
    return NextResponse.json({ error: "Weather unavailable" }, { status: 502 });
  }
}
