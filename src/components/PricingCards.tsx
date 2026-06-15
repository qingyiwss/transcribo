import { Check, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: number;
  minutes: number;
  features: string[];
  popular?: boolean;
}

const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 5,
    minutes: 100,
    features: [
      "100 minutes of transcription",
      "50+ languages supported",
      "Export as plain text",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 15,
    minutes: 350,
    popular: true,
    features: [
      "350 minutes of transcription",
      "50+ languages supported",
      "Export as SRT, VTT, TXT",
      "Priority email support",
      "Speaker diarization",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: 30,
    minutes: 750,
    features: [
      "750 minutes of transcription",
      "50+ languages supported",
      "Export as SRT, VTT, TXT, JSON",
      "Priority support",
      "Speaker diarization",
      "Batch uploads",
    ],
  },
];

export default function PricingCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "relative flex flex-col rounded-2xl border-2 p-6 transition-shadow hover:shadow-lg",
            plan.popular
              ? "border-indigo-500 bg-white shadow-md"
              : "border-zinc-200 bg-white"
          )}
        >
          {/* Popular badge */}
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
                <Zap className="h-3 w-3" />
                Popular
              </span>
            </div>
          )}

          {/* Plan name */}
          <h3 className="text-lg font-bold text-zinc-900">{plan.name}</h3>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-0.5">
            <span className="text-4xl font-extrabold text-zinc-900">
              ${plan.price}
            </span>
            <span className="text-sm text-zinc-500">/one-time</span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-600">
            {plan.minutes} minutes
          </p>

          {/* Features */}
          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                <span className="text-sm text-zinc-600">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA — disabled during beta */}
          <button
            disabled
            className={cn(
              "mt-6 flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold cursor-not-allowed opacity-60",
              plan.popular
                ? "bg-indigo-600 text-white"
                : "border border-indigo-600 bg-white text-indigo-600"
            )}
          >
            Free in Beta
          </button>
        </div>
      ))}
    </div>
  );
}
