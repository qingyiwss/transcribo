import PricingCards from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-zinc-900">
          Choose a Plan
        </h1>
        <p className="text-sm text-zinc-500">
          Top up your credits and keep transcribing. No subscriptions, pay as
          you go.
        </p>
      </div>
      <PricingCards />
    </div>
  );
}
