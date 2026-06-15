import Link from "next/link";
import { Mic, Upload, Download, Check, ChevronRight, Home, Wrench } from "lucide-react";
import type { ToolData } from "@/lib/tools-data";

const features = [
  "Supports 50+ languages",
  "98% accuracy",
  "Download as TXT, SRT, VTT",
  "No credit card required",
  "Fast processing",
  "Secure & private",
];

const steps = [
  {
    icon: Upload,
    title: "Upload",
    description: "Drag & drop your audio or video file. We support all major formats.",
  },
  {
    icon: Mic,
    title: "Transcribe",
    description: "Our AI engine processes your file in seconds with high accuracy.",
  },
  {
    icon: Download,
    title: "Download",
    description: "Get your transcript as text, SRT subtitles, or VTT format.",
  },
];

export default function ToolPage({ tool }: { tool: ToolData }) {
  return (
    <div className="flex flex-col flex-1">
      {/* Breadcrumb */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/tools/mp3-to-text" className="inline-flex items-center gap-1 hover:text-indigo-600 transition-colors">
              <Wrench className="h-3.5 w-3.5" />
              Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-zinc-900 font-medium truncate">{tool.h1}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white px-4 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-5 text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl sm:leading-tight">
            {tool.h1}
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-zinc-600">
            {tool.subheading}
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 active:scale-[0.98]"
          >
            {tool.ctaText}
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            Why Transcribo?
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                <span className="text-sm font-medium text-zinc-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-zinc-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            Perfect for
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tool.useCases.map((useCase) => (
              <div
                key={useCase}
                className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-sm font-semibold text-zinc-800">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-bold text-zinc-900 sm:text-3xl">
            How It Works
          </h2>
          <div className="grid gap-10 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="mb-5 rounded-2xl bg-indigo-100 p-5">
                  <step.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-zinc-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
            Ready to transcribe?
          </h2>
          <p className="mb-8 text-lg text-indigo-100">
            Start transcribing for free — no credit card required. Get your first 3 files transcribed instantly.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 shadow-lg transition-all hover:bg-indigo-50 active:scale-[0.98]"
          >
            {tool.ctaText}
            <ChevronRight className="h-5 w-5" />
          </Link>
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
