import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabaseUrl = 'https://higwdgyondsowcaohfdm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpZ3dkZ3lvbmRzb3djYW9oZmRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MzQ4MDEsImV4cCI6MjA5MTIxMDgwMX0.M-O9DbBuuMm8AbI3igs00U4TVZKaG1u2wZVMzNGO2VE';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseSecondary = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  }
});