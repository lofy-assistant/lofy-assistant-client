export const plans = [
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_fZu14mdBh1aGdDxezX2VG01"
        : "https://buy.stripe.com/8x27sNa1G6du5mJ1jCdEs03",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1StO0RBSILEw5PUU1o2Xt1BT"
        : "price_1StSEKPXWy5Z5igtBI8g6E9O",
    price: 20,
    duration: "/month",
    billingCycle: "monthly" as const,
  },
  // {
  //   link:
  //     process.env.NODE_ENV === "development"
  //       ? "https://buy.stripe.com/test_4gM00i40H5qWarl9fD2VG00"
  //       : "https://buy.stripe.com/8x2cN7gq40TaeXjd2kdEs01",
  //   priceId:
  //     process.env.NODE_ENV === "development"
  //       ? "price_1StNzuBSILEw5PUUDdMQudxW"
  //       : "price_1StQkIPXWy5Z5igt5cQiCxdR",
  //   price: 5,
  //   duration: "/month",
  //   billingCycle: "monthly" as const,
  // },
  {
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_fZu14mdBh1aGdDxezX2VG01"
        : "https://buy.stripe.com/6oUeVfc9OgS8aH3bYgdEs02",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1StO0RBSILEw5PUU1o2Xt1BT"
        : "price_1StQkGPXWy5Z5igtaFZKxUyI",
    price: 45,
    duration: "/year",
    billingCycle: "yearly" as const,
  },
];
