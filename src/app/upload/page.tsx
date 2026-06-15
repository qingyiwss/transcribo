import UploadZone from "@/components/UploadZone";

export default function UploadPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-2 text-3xl font-extrabold text-zinc-900">
        Upload Audio File
      </h1>
      <p className="mb-10 text-sm text-zinc-500">
        Upload an audio file and we&apos;ll transcribe it in seconds
      </p>
      <UploadZone />
    </div>
  );
}
