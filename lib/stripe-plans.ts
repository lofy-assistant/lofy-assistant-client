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
    price: 5,
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
    price: 45,
    duration: "/year",
    billingCycle: "yearly" as const,
  },
];
