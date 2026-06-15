export interface ToolData {
  slug: string;
  title: string;
  description: string;
  h1: string;
  subheading: string;
  useCases: string[];
  ctaText: string;
}

export const tools: ToolData[] = [
  {
    slug: "mp3-to-text",
    title: "MP3 to Text Converter — Free Online Transcription",
    description:
      "Convert MP3 audio to text in seconds. Free online transcription with 98% accuracy. Supports 50+ languages. No signup required for first 3 files.",
    h1: "MP3 to Text Converter",
    subheading: "Turn your MP3 files into accurate text transcripts in seconds",
    useCases: ["Podcast episodes", "Voice memos", "Lecture recordings", "Interview audio"],
    ctaText: "Convert MP3 to Text Free",
  },
  {
    slug: "mp4-to-text",
    title: "MP4 to Text — Transcribe Video to Text Online Free",
    description:
      "Convert MP4 video to text with AI. Extract transcripts from video files in 50+ languages. Download as TXT, SRT, or VTT subtitles.",
    h1: "MP4 to Text Converter",
    subheading: "Extract text from MP4 videos — automatically, accurately, fast",
    useCases: ["YouTube videos", "TikTok / Reels", "Webinar recordings", "Course videos"],
    ctaText: "Convert MP4 to Text Free",
  },
  {
    slug: "youtube-to-text",
    title: "YouTube Video to Text — Free Transcript Generator",
    description:
      "Convert any YouTube video to text. Generate accurate transcripts and subtitles for YouTube content. Export as SRT for captions.",
    h1: "YouTube Video to Text",
    subheading: "Generate transcripts from YouTube videos in one click",
    useCases: ["Content repurposing", "SEO optimization", "Subtitle creation", "Research & notes"],
    ctaText: "Transcribe YouTube Video",
  },
  {
    slug: "podcast-to-text",
    title: "Podcast to Text Transcription — Free & Accurate",
    description:
      "Transcribe podcast episodes to text. Improve SEO, create show notes, and make your podcast accessible. 50+ languages supported.",
    h1: "Podcast to Text",
    subheading: "Turn podcast episodes into searchable, shareable text",
    useCases: ["Show notes generation", "SEO boost", "Accessibility compliance", "Content repurposing"],
    ctaText: "Transcribe Podcast Free",
  },
  {
    slug: "meeting-transcription",
    title: "Meeting Transcription — AI Notes for Zoom, Teams, Google Meet",
    description:
      "Automatically transcribe meeting recordings. Turn Zoom, Teams, and Google Meet recordings into searchable notes and action items.",
    h1: "Meeting Transcription Tool",
    subheading: "Never lose meeting details again — auto-transcribe and search",
    useCases: ["Zoom recordings", "Microsoft Teams", "Google Meet", "Client calls"],
    ctaText: "Transcribe Meeting Free",
  },
  {
    slug: "video-to-text",
    title: "Free Video to Text Converter — Online Transcription Tool",
    description:
      "Convert video to text free online. Transcribe any video format — MP4, MOV, AVI, WebM, MKV. No account needed for first 3 files.",
    h1: "Video to Text Converter",
    subheading: "Free online video transcription — fast, accurate, secure",
    useCases: ["Social media clips", "Training videos", "Documentaries", "Vlogs"],
    ctaText: "Convert Video to Text Free",
  },
  {
    slug: "audio-to-srt",
    title: "Audio to SRT Subtitles — Generate Subtitles Online Free",
    description:
      "Convert audio to SRT subtitle files online. Perfect for video captions, accessibility, and localization. Supports MP3, WAV, FLAC, M4A.",
    h1: "Audio to SRT Converter",
    subheading: "Generate SRT subtitle files from any audio recording",
    useCases: ["Video captions", "Accessibility (WCAG)", "Multilingual subtitles", "Content localization"],
    ctaText: "Generate SRT Free",
  },
  {
    slug: "interview-transcription",
    title: "Interview Transcription — AI Transcripts for Research & Journalism",
    description:
      "Transcribe interviews automatically. Perfect for journalists, researchers, and recruiters. Speaker identification and timestamps included.",
    h1: "Interview Transcription Tool",
    subheading: "Turn interviews into searchable transcripts with speaker labels",
    useCases: ["Journalism", "User research", "Job interviews", "Podcast interviews"],
    ctaText: "Transcribe Interview Free",
  },
  {
    slug: "wav-to-text",
    title: "WAV to Text — Convert WAV Files to Transcripts Online",
    description:
      "Convert WAV audio files to text online. High-quality lossless audio transcription. Download as TXT, SRT, or VTT format.",
    h1: "WAV to Text Converter",
    subheading: "Convert lossless WAV audio to accurate text instantly",
    useCases: ["Studio recordings", "Voiceovers", "Music production notes", "Dictation files"],
    ctaText: "Convert WAV to Text Free",
  },
  {
    slug: "arabic-speech-to-text",
    title: "Arabic Speech to Text — تحويل الصوت إلى نص بالعربية",
    description:
      "Arabic speech to text transcription. Convert Arabic audio to text with high accuracy. Support for Modern Standard Arabic and major dialects.",
    h1: "Arabic Speech to Text",
    subheading: "Accurate Arabic transcription — Modern Standard & dialects",
    useCases: ["Arabic podcasts", "Arabic interviews", "Arabic lectures", "Arabic voice notes"],
    ctaText: "Transcribe Arabic Free",
  },
];

export function getToolBySlug(slug: string): ToolData | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getAllToolSlugs(): string[] {
  return tools.map((t) => t.slug);
}
