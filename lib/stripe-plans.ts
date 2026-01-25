export const plans = [
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_4gM00i40H5qWarl9fD2VG00"
        : '',
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1StNzuBSILEw5PUUDdMQudxW"
        : '',
    price: 5,
    duration: "/month",
    billingCycle: "monthly" as const,
  },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_fZu14mdBh1aGdDxezX2VG01"
        : '',
    priceId:
      process.env.NODE_ENV === "development"
        ? 'price_1StO0RBSILEw5PUU1o2Xt1BT'
        : '',
    price: 45,
    duration: "/year",
    billingCycle: "yearly" as const,
  },
];
