import Link from "next/link";
import { Mic } from "lucide-react";

export const metadata = {
  title: "Free Online Transcription Tools — Convert Audio & Video to Text",
  description:
    "Free online transcription tools. Convert MP3, MP4, WAV, and more to text. YouTube to text, podcast transcription, meeting notes. No signup required.",
};

export default function ToolsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Minimal header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-zinc-900 hover:text-zinc-700 transition-colors">
            <Mic className="h-6 w-6" />
            <span className="text-lg font-bold">Transcribo</span>
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Start Free
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
