"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileAudio, Loader2, X } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

const ALLOWED_TYPES = [
  "audio/mpeg", "audio/mp3",
  "audio/wav", "audio/wave", "audio/x-wav",
  "audio/mp4", "audio/m4a", "audio/x-m4a",
  "audio/ogg", "audio/opus",
  "audio/webm",
  "audio/flac", "audio/x-flac",
  "audio/aac",
  "audio/x-ms-wma",
  "audio/aiff", "audio/x-aiff",
  "audio/amr",
  "audio/x-alac",
  "audio/ac3",
  "audio/midi", "audio/x-midi",
  // Video — preview only, server-side processing coming soon
  "video/mp4", "video/quicktime", "video/x-msvideo",
  "video/x-matroska", "video/webm", "video/x-flv",
  "video/x-ms-wmv", "video/x-m4v",
  "video/3gpp", "video/3gpp2", "video/mp2t",
  "video/vob", "video/ogg",
];

const ALLOWED_EXTENSIONS = [
  ".mp3", ".wav", ".m4a", ".ogg", ".flac",
  ".opus", ".aac", ".wma",
  ".aiff", ".alac", ".ac3", ".amr", ".mid", ".midi",
  ".mp4", ".mov", ".avi", ".mkv", ".webm", ".flv",
  ".wmv", ".m4v", ".3gp", ".3g2", ".mts", ".m2ts", ".vob", ".ogv", ".ts",
];

export default function UploadZone() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (f: File): boolean => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(f.type)) {
      setError(
        `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
      );
      return false;
    }
    if (f.size > 500 * 1024 * 1024) {
      setError("File too large. Maximum size is 500 MB.");
      return false;
    }
    return true;
  };

  const handleFile = useCallback((f: File) => {
    setError(null);
    if (validateFile(f)) {
      setFile(f);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTranscribe = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Transcription failed");
      }

      const data = await res.json();
      router.push(`/transcribe/${data.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!file ? handleClick : undefined}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-200 cursor-pointer",
          isDragging
            ? "border-indigo-500 bg-indigo-50 scale-[1.02]"
            : "border-zinc-300 bg-zinc-50 hover:border-indigo-400 hover:bg-indigo-50/50",
          file && "cursor-default"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_EXTENSIONS.join(",")}
          onChange={handleInputChange}
          className="hidden"
        />

        {!file ? (
          <>
            <div className="mb-4 rounded-full bg-indigo-100 p-4">
              <Upload className="h-8 w-8 text-indigo-600" />
            </div>
            <p className="mb-1 text-lg font-semibold text-zinc-700">
              Drag & drop your audio or video file here
            </p>
            <p className="mb-4 text-sm text-zinc-500">
              or click to browse
            </p>
            <p className="text-xs text-zinc-400">
              Audio: MP3, WAV, M4A, OGG, FLAC &bull; Video: MP4, MOV, WebM, MKV &bull; Up to 500 MB
            </p>
          </>
        ) : (
          <div className="flex w-full items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
              <FileAudio className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-800">
                {file.name}
              </p>
              <p className="text-xs text-zinc-500">{formatBytes(file.size)}</p>
            </div>
            {!isUploading && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-600"
                aria-label="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Transcribe button */}
      {file && !isUploading && (
        <button
          onClick={handleTranscribe}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
        >
          <FileAudio className="h-4 w-4" />
          Transcribe
        </button>
      )}

      {/* Uploading spinner */}
      {isUploading && (
        <div className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-100 px-6 py-3 text-sm font-semibold text-indigo-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          Transcribing your audio...
        </div>
      )}
    </div>
  );
}
