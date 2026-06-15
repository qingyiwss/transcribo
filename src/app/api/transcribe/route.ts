import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { randomUUID } from "crypto";

const RATE_PER_MINUTE = 0.05; // $0.05/min

const ALLOWED_AUDIO_EXTENSIONS = ["wav","mp3","ogg","opus","flac","aac","wma","m4a","aiff","alac","ac3","amr","mid","midi"];
const ALLOWED_VIDEO_EXTENSIONS = ["mp4","mov","avi","mkv","webm","flv","wmv","m4v","3gp","3g2","mts","m2ts","vob","ogv","ts"];
const ALLOWED_EXTENSIONS = [...ALLOWED_AUDIO_EXTENSIONS, ...ALLOWED_VIDEO_EXTENSIONS];

interface VolcResponse {
  audio_info?: { duration?: number };
  result?: { text?: string; additions?: { duration?: string } };
}

export async function POST(request: NextRequest) {
  try {
    // Use request-based cookies for Vercel compatibility
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set({ name, value, ...options })
            );
          },
        },
      }
    );
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Unsupported file format: .${ext}. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      );
    }

    const isVideo = ALLOWED_VIDEO_EXTENSIONS.includes(ext);

    // Video → send to video-worker for audio extraction
    let base64: string;
    let volcFormat: string;

    if (isVideo) {
      const workerUrl = process.env.VIDEO_WORKER_URL || "http://127.0.0.1:8788";
      const workerForm = new FormData();
      workerForm.append("file", file);

      const workerResp = await fetch(`${workerUrl}/extract`, {
        method: "POST",
        headers: { "x-worker-token": process.env.VIDEO_WORKER_TOKEN! },
        body: workerForm,
      });

      if (!workerResp.ok) {
        const wErr = await workerResp.json().catch(() => ({}));
        return NextResponse.json({ error: "Video extraction failed", detail: wErr }, { status: 500 });
      }

      const workerData = await workerResp.json();
      base64 = workerData.audio_base64;
      volcFormat = workerData.format || "wav";
    } else {
      const fileBytes = Buffer.from(await file.arrayBuffer());
      base64 = fileBytes.toString("base64");

      // Map audio extension to Volcengine format
      const formatMap: Record<string, string> = {
        wav: "wav", mp3: "mp3", ogg: "ogg", opus: "ogg",
        m4a: "mp3", aac: "mp3", ac3: "mp3",
        flac: "wav", wma: "wav", aiff: "wav", alac: "wav",
        amr: "mp3", mid: "mp3", midi: "mp3",
      };
      volcFormat = formatMap[ext] || "wav";
    }

    // Estimate duration: ~1MB ≈ 1 minute for MP3, ~10MB ≈ 1 minute for WAV
    const sizeMB = file.size / (1024 * 1024);
    const isWavLike = ext === "wav" || ext === "flac" || ext === "aiff" || ext === "alac";
    const estimatedMinutes = isWavLike ? sizeMB / 10 : sizeMB;
    const estimatedCost = Math.max(0.01, Math.ceil(estimatedMinutes * RATE_PER_MINUTE * 100) / 100);

    // Bypass credit check during beta (set to false to enable)
    const SKIP_CREDIT_CHECK = true;

    let { data: profile } = await supabase
      .from("profiles")
      .select("credits_remaining")
      .eq("id", session.user.id)
      .single();

    if (!profile) {
      await supabase.from("profiles").insert({ id: session.user.id, email: session.user.email, credits_remaining: 999 });
      profile = { credits_remaining: 999 };
    }

    if (!SKIP_CREDIT_CHECK && (profile?.credits_remaining || 0) < estimatedCost) {
      return NextResponse.json({
        error: "Insufficient credits", required: estimatedCost, available: profile.credits_remaining,
      }, { status: 402 });
    }

    // Create transcription record
    const { data: transcription, error: insertError } = await supabase
      .from("transcriptions")
      .insert({ user_id: session.user.id, filename: file.name, file_size: file.size, status: "processing", cost: 0 })
      .select().single();

    if (insertError || !transcription) {
      return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
    }

    // Call Volcengine ASR
    const volcResponse = await fetch(
      "https://openspeech.bytedance.com/api/v3/auc/bigmodel/recognize/flash",
      {
        method: "POST",
        headers: {
          "X-Api-App-Key": process.env.VOLC_APP_ID!,
          "X-Api-Access-Key": process.env.VOLC_ACCESS_KEY!,
          "X-Api-Resource-Id": "volc.bigasr.auc_turbo",
          "X-Api-Request-Id": randomUUID(),
          "X-Api-Sequence": "-1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: { uid: process.env.VOLC_APP_ID! },
          audio: { data: base64, format: volcFormat },
          request: { model_name: "bigmodel" },
        }),
      }
    );

    const statusCode = volcResponse.headers.get("X-Api-Status-Code");
    const volcData: VolcResponse = await volcResponse.json();

    if (statusCode !== "20000000") {
      await supabase.from("transcriptions").update({ status: "failed" }).eq("id", transcription.id);
      return NextResponse.json({ error: "Transcription failed", code: statusCode, detail: volcData }, { status: 500 });
    }

    const text = volcData.result?.text || "";
    const durationSeconds = (volcData.audio_info?.duration || 0) / 1000;
    const actualCost = Math.max(0.01, Math.ceil((durationSeconds / 60) * RATE_PER_MINUTE * 100) / 100);

    await supabase.from("transcriptions").update({
      status: "completed", text_content: text, duration_seconds: durationSeconds, cost: actualCost,
    }).eq("id", transcription.id);

    if (!SKIP_CREDIT_CHECK) {
      await supabase.from("profiles").update({
        credits_remaining: profile.credits_remaining - actualCost,
      }).eq("id", session.user.id);
    }

    return NextResponse.json({ id: transcription.id, text_content: text, duration_seconds: durationSeconds, cost: actualCost });
  } catch (err) {
    console.error("Transcribe error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
