import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string; // Type assertion
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY as string; // Type assertion

export const supabase = createClient(supabaseUrl, supabaseAnonKey);