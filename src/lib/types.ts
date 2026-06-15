export interface Profile {
  id: string;
  email: string;
  credits_remaining: number;
  total_minutes_transcribed: number;
}

export interface Transcription {
  id: string;
  user_id: string;
  filename: string;
  file_size: number;
  duration_seconds: number;
  status: "processing" | "completed" | "failed";
  text_content: string | null;
  cost: number;
  created_at: string;
}

export interface PricingPlan {
  name: string;
  credits: number;
  minutes: number;
  price: number;
  priceId: string;
  popular?: boolean;
}
