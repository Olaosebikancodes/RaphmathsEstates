import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://your-project.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth Helpers
export const signUp = (email, password) =>
  supabase.auth.signUp({ email, password });
export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });
export const signOut = () => supabase.auth.signOut();
export const getUser = () => supabase.auth.getUser();

// Helper for tracking clicks
export const trackPropertyClick = async (propertyId) => {
  try {
    const { error } = await supabase.from("property_clicks").insert([
      {
        property_id: propertyId,
        user_agent: navigator.userAgent,
      },
    ]);
    if (error) {
      // Background click tracking failure - silent for UX
    }
  } catch (err) {
    // Silent for UX
  }
};
