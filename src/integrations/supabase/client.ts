// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zeozuwogeyatylznawjp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inplb3p1d29nZXlhdHlsem5hd2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4OTI3ODYsImV4cCI6MjA2MDQ2ODc4Nn0.GBSW6AhLUMMkw4QxTXfL5ueN08LNeEax_Qx6xmHOZjI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);