import AppNavbar from "@/components/app-navbar";

export default function PricingPage() {
  return (
    <div>
      <AppNavbar />
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Pricing Plans
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Choose the plan that best fits your needs and start boosting your
            productivity today.
          </p>
        </div>
      </div>
    </div>
  );
}
