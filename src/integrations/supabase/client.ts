// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mirovykaaduhmhbncrun.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pcm92eWthYWR1aG1oYm5jcnVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwNTMxOTAsImV4cCI6MjA1MDYyOTE5MH0.7JJug7eclmaYs8yxtfQHfIaGBM-NE_gfo1q-KU5kQz8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);