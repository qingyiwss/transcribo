import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Coins,
  Clock,
  BarChart3,
  Upload,
  CreditCard,
  FileText,
  ArrowRight,
} from "lucide-react";
import { formatDuration, formatDate } from "@/lib/utils";
import type { Profile, Transcription } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_remaining, total_minutes_transcribed")
    .eq("id", user.id)
    .single<Profile>();

  const creditsRemaining = profile?.credits_remaining ?? 0;
  const totalMinutes = profile?.total_minutes_transcribed ?? 0;

  // Credits percentage —  capped at 100% for progress bar
  const maxCredits = Math.max(100, creditsRemaining);
  const creditsPercentage = Math.min(
    Math.round((creditsRemaining / maxCredits) * 100),
    100
  );

  // Fetch recent transcriptions
  const { data: recentTranscriptions } = await supabase
    .from("transcriptions")
    .select("id, filename, status, duration_seconds, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<Transcription[]>();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">Dashboard</h1>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {/* Credits card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-indigo-100 p-1.5">
              <Coins className="h-5 w-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-zinc-500">Credits</span>
          </div>
          <p className="mb-1 text-3xl font-extrabold text-zinc-900">
            {creditsRemaining}
          </p>
          <p className="mb-3 text-sm text-zinc-500">minutes remaining</p>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-500"
              style={{ width: `${creditsPercentage}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-zinc-400">
            {creditsPercentage}% of Starter baseline
          </p>
        </div>

        {/* This Month card — placeholder until monthly tracking added */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-amber-100 p-1.5">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-zinc-500">This Month</span>
          </div>
          <p className="mb-1 text-3xl font-extrabold text-zinc-900">
            {formatDuration(0)}
          </p>
          <p className="text-sm text-zinc-500">minutes transcribed</p>
        </div>

        {/* Total card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-1.5">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-zinc-500">Total</span>
          </div>
          <p className="mb-1 text-3xl font-extrabold text-zinc-900">
            {formatDuration(totalMinutes)}
          </p>
          <p className="text-sm text-zinc-500">total minutes transcribed</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            <Upload className="h-4 w-4" />
            Start Transcribing
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-indigo-600 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-600 transition-all hover:bg-indigo-50 active:scale-[0.98]"
          >
            <CreditCard className="h-4 w-4" />
            Top Up Credits
          </Link>
        </div>
      </div>

      {/* Recent transcriptions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-zinc-800">
          Recent Transcriptions
        </h2>
        {recentTranscriptions && recentTranscriptions.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            <div className="divide-y divide-zinc-100">
              {recentTranscriptions.map((t) => (
                <Link
                  key={t.id}
                  href={`/transcribe/${t.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-zinc-50"
                >
                  <div className="rounded-lg bg-indigo-100 p-2">
                    <FileText className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-zinc-800">
                      {t.filename}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(t.created_at)} &bull;{" "}
                      {formatDuration(t.duration_seconds)}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        t.status === "completed"
                          ? "bg-emerald-100 text-emerald-700"
                          : t.status === "processing"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-zinc-300" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-12 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-zinc-300" />
            <p className="text-sm font-medium text-zinc-500">
              No transcriptions yet
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              Upload your first audio file to get started
            </p>
            <Link
              href="/upload"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Start Transcribing
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
