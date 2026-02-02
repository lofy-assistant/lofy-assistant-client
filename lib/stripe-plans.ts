/** Resolve Stripe currency from country (use country, not locale). */
export function resolveCurrency(country?: string): string {
  return country === "MY" ? "myr" : "usd";
}

/** Resolve currency from IP-derived country (e.g. Vercel x-vercel-ip-country). */
export function resolveCurrencyFromIP(country?: string): "myr" | "usd" {
  if (country === "MY") return "myr";
  return "usd";
}

export const plans = [
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_4gM00i40H5qWarl9fD2VG00"
        : "https://buy.stripe.com/3cI5kFc9O31ig1n2nGdEs06",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1StNzuBSILEw5PUUDdMQudxW"
        : "price_1SwSV5PXWy5Z5igtCk3AWIcV",
    priceUsd: 5,
    priceMyr: 15,
    duration: "/month",
    billingCycle: "monthly" as const,
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_fZu14mdBh1aGdDxezX2VG01"
        : "https://buy.stripe.com/14A28t5LqatK8yVd2kdEs07",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1StO0RBSILEw5PUU1o2Xt1BT"
        : "price_1SwSXQPXWy5Z5igtsOoAFuC6",
    priceUsd: 45,
    priceMyr: 135,
    duration: "/year",
    billingCycle: "yearly" as const,
  },
];
