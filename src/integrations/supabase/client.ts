import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://klvuxfxvevksilkzfopv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsdnV4Znh2ZXZrc2lsa3pmb3B2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0MzU2MDAsImV4cCI6MjAyNjAxMTYwMH0.PkpBEfpJPGYIGSpYUfnDSbMHQk9dYVxrKYrkWXNBqeY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Since we're not using auth anymore
    autoRefreshToken: false,
  },
});