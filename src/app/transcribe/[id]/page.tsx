import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Clock, DollarSign, Upload } from "lucide-react";
import { formatDate, formatDuration, formatBytes } from "@/lib/utils";
import type { Transcription } from "@/lib/types";

function generateTxtContent(transcription: Transcription): string {
  const header = [
    `File: ${transcription.filename}`,
    `Transcribed: ${formatDate(transcription.created_at)}`,
    `Duration: ${formatDuration(transcription.duration_seconds)}`,
    "",
    "--- Transcription ---",
    "",
  ].join("\n");
  return header + (transcription.text_content || "");
}

function generateSrtContent(transcription: Transcription): string {
  if (!transcription.text_content) {
    return "";
  }

  // Simple SRT generation: treat each paragraph/sentence as a subtitle block
  const lines = transcription.text_content
    .split(/\n\n+/)
    .filter((l) => l.trim());

  if (lines.length === 0) {
    const srtLines = [
      "1",
      "00:00:00,000 --> 00:00:05,000",
      transcription.text_content.trim(),
      "",
    ];
    return srtLines.join("\n");
  }

  const totalSeconds = transcription.duration_seconds || 60;
  const interval = totalSeconds / lines.length;

  return lines
    .map((text, i) => {
      const startSeconds = i * interval;
      const endSeconds = (i + 1) * interval;

      const formatTime = (s: number): string => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = Math.floor(s % 60);
        const ms = Math.floor((s % 1) * 1000);
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
      };

      return `${i + 1}\n${formatTime(startSeconds)} --> ${formatTime(endSeconds)}\n${text.trim()}\n`;
    })
    .join("\n");
}

export default async function TranscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // Fetch the transcription
  const { data: transcription } = await supabase
    .from("transcriptions")
    .select("*")
    .eq("id", id)
    .single<Transcription>();

  if (!transcription) {
    notFound();
  }

  // Verify ownership
  if (transcription.user_id !== user.id) {
    notFound();
  }

  const txtContent = generateTxtContent(transcription);
  const srtContent = generateSrtContent(transcription);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900 break-all">
          {transcription.filename}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {formatDuration(transcription.duration_seconds)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            {formatBytes(transcription.file_size)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <DollarSign className="h-4 w-4" />
            ${transcription.cost.toFixed(2)}
          </span>
          <span>{formatDate(transcription.created_at)}</span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              transcription.status === "completed"
                ? "bg-emerald-100 text-emerald-700"
                : transcription.status === "processing"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {transcription.status}
          </span>
        </div>
      </div>

      {/* Download buttons */}
      {transcription.status === "completed" && transcription.text_content && (
        <div className="mb-6 flex flex-wrap gap-3">
          {/* TXT download */}
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(txtContent)}`}
            download={`${transcription.filename.replace(/\.[^.]+$/, "")}.txt`}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Download TXT
          </a>

          {/* SRT download */}
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(srtContent)}`}
            download={`${transcription.filename.replace(/\.[^.]+$/, "")}.srt`}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all hover:bg-zinc-50 active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Download SRT
          </a>
        </div>
      )}

      {/* Failed state */}
      {transcription.status === "failed" && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-medium text-red-700">
            This transcription failed to process. Please try uploading the file again.
          </p>
        </div>
      )}

      {/* Processing state */}
      {transcription.status === "processing" && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <p className="text-sm font-medium text-amber-700">
              Processing your transcription... This may take a moment.
            </p>
          </div>
        </div>
      )}

      {/* Transcription content */}
      {transcription.text_content && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Transcription
          </h2>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-zinc-700">
            {transcription.text_content}
          </pre>
        </div>
      )}

      {/* Transcribe Another button */}
      <div className="mt-8">
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          <Upload className="h-4 w-4" />
          Transcribe Another
        </Link>
      </div>
    </div>
  );
}
