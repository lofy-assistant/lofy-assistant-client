/**
 * One-off: create Pro monthly recurring price in MYR (RM14.99) on the
 * "Lofy Assistant Pro (Monthly)" Stripe product (same product as the USD monthly price).
 *
 * Usage: npx tsx scripts/create-pro-monthly-myr-price.ts
 */
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({ path: ".env" });

const AMOUNT_SEN = 1499; // RM 14.99

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("Missing STRIPE_SECRET_KEY in .env");
    process.exit(1);
  }
  const stripe = new Stripe(key);
  const isLive = key.startsWith("sk_live");
  const refPriceId = isLive
    ? "price_1TNKMUPXWy5Z5igtzipoeYLU"
    : "price_1StNzuBSILEw5PUUDdMQudxW";

  const ref = await stripe.prices.retrieve(refPriceId);
  const product =
    typeof ref.product === "string" ? ref.product : ref.product.id;

  const created = await stripe.prices.create({
    product,
    currency: "myr",
    unit_amount: AMOUNT_SEN,
    recurring: { interval: "month" },
    nickname: "Pro monthly (MYR)",
    metadata: { tier: "pro", billing_cycle: "monthly", list_amount_myr: "14.99" },
  });

  console.log("Created MYR price:", created.id);
  console.log("Created price id (app uses a single catalog price per plan):", created.id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
