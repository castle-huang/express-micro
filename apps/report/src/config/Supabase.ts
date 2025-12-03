import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yezcbbljwyhnxyaqkgsb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllemNiYmxqd3lobnh5YXFrZ3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxNTExMDIsImV4cCI6MjA3ODcyNzEwMn0.PJL9nHBrbcaVeGCl9jwNjGbOVoOWTDGcF74UKOQMSeQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
