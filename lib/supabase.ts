import { createClient } from "@supabase/supabase-js";

const supabaseUrl = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL || "")
  : (process.env.NEXT_PUBLIC_SUPABASE_URL || "");

const supabaseAnonKey = typeof window !== "undefined"
  ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "");

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to check if Supabase is connected
export const isSupabaseConnected = (): boolean => {
  return !!supabase;
};
