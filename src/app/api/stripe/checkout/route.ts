import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const PLANS: Record<
  string,
  { name: string; priceId: string; credits: number; price: number }
> = {
  starter: {
    name: "Starter",
    priceId: "price_placeholder_starter",
    credits: 100,
    price: 5,
  },
  pro: {
    name: "Pro",
    priceId: "price_placeholder_pro",
    credits: 350,
    price: 15,
  },
  business: {
    name: "Business",
    priceId: "price_placeholder_business",
    credits: 750,
    price: 30,
  },
};

export async function GET(request: Request) {
  const supabase = await createClient();

  // 1. Verify user authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/login?error=please_log_in", request.url)
    );
  }

  // 2. Parse plan parameter
  const { searchParams } = new URL(request.url);
  const planKey = searchParams.get("plan");

  if (!planKey || !PLANS[planKey]) {
    return NextResponse.redirect(
      new URL("/pricing?error=invalid_plan", request.url)
    );
  }

  const plan = PLANS[planKey];

  // 3. Initialize Stripe
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        plan: planKey,
        credits: String(plan.credits),
      },
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.redirect(
        new URL("/pricing?error=checkout_failed", request.url)
      );
    }

    // 5. Redirect to Stripe Checkout
    return NextResponse.redirect(session.url);
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.redirect(
      new URL("/pricing?error=stripe_error", request.url)
    );
  }
}
