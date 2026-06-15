import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PricingCards from "@/components/PricingCards";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/dashboard"
        className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-extrabold text-zinc-900">Choose a Plan</h1>
        <p className="text-sm text-zinc-500">
          Top up your credits and keep transcribing. No subscriptions, pay as you go.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm text-amber-700">
          Payments coming soon — free during beta
        </div>
      </div>
      <PricingCards />
    </div>
  );
}
