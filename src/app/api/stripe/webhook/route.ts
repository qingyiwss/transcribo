import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Read the raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.user_id;
    const creditsStr = session.metadata?.credits;

    if (!userId || !creditsStr) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    const credits = Number(creditsStr);

    if (isNaN(credits) || credits <= 0) {
      console.error("Invalid credits value in metadata:", creditsStr);
      return NextResponse.json(
        { error: "Invalid credits value" },
        { status: 400 }
      );
    }

    // Update the user's profile — add credits
    const supabase = await createClient();

    // First get current credits
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits_remaining")
      .eq("id", userId)
      .single();

    if (!profile) {
      console.error("Profile not found for user:", userId);
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const newCredits =
      Math.round((profile.credits_remaining + credits) * 100) / 100;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ credits_remaining: newCredits })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update credits:", updateError);
      return NextResponse.json(
        { error: "Failed to update credits" },
        { status: 500 }
      );
    }

    console.log(
      `Credits updated for user ${userId}: +${credits} → ${newCredits} total`
    );
  }

  return NextResponse.json({ received: true });
}
