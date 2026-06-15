import Link from "next/link";
import { Upload, Mic, Download, ArrowRight } from "lucide-react";
import PricingCards from "@/components/PricingCards";

export default function LandingPage() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl sm:leading-tight">
            Turn Audio into Text,{" "}
            <span className="text-indigo-600">Instantly</span>
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-zinc-600">
            AI-powered transcription in 50+ languages. Upload, transcribe,
            download.
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            Start Transcribing
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-center text-3xl font-bold text-zinc-900">
            How It Works
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 rounded-2xl bg-indigo-100 p-5">
                <Upload className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                Upload
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                Drag & drop your audio file. We support MP3, WAV, M4A, OGG,
                WebM, and FLAC formats.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 rounded-2xl bg-indigo-100 p-5">
                <Mic className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                Transcribe
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                Our AI engine processes your audio in seconds with high accuracy
                across 50+ languages.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 rounded-2xl bg-indigo-100 p-5">
                <Download className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-zinc-900">
                Download
              </h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                Get your transcription as plain text or export as SRT and VTT
                subtitle files.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-zinc-50 px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-zinc-900">
            Simple, Transparent Pricing
          </h2>
          <p className="mb-12 text-center text-sm text-zinc-500">
            Pay as you go. No subscriptions, no hidden fees.
          </p>
          <PricingCards />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white px-4 py-8">
        <div className="mx-auto max-w-5xl text-center text-sm text-zinc-400">
          &copy; 2026 Transcribo
        </div>
      </footer>
    </div>
  );
}
