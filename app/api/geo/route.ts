import { NextRequest, NextResponse } from "next/server";
import { resolveCurrencyFromIP } from "@/lib/stripe-plans";

/** Vercel sets this header to the client's country code (ISO 3166-1 alpha-2, e.g. MY, US). */
const VERCEL_IP_COUNTRY_HEADER = "x-vercel-ip-country";

/**
 * GET /api/geo
 * Returns country and currency from IP (Vercel edge). Use for pricing display and checkout.
 */
export async function GET(req: NextRequest) {
  const country = req.headers.get(VERCEL_IP_COUNTRY_HEADER)?.toUpperCase() ?? null;
  const currency = resolveCurrencyFromIP(country ?? undefined);

  return NextResponse.json({
    country,
    currency,
  });
}
