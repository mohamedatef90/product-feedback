import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vlvnspduyppszgtwyjqi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsdm5zcGR1eXBwc3pndHd5anFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNTk1MzEsImV4cCI6MjA3NzkzNTUzMX0.ePygT06x06Gd9q1gMepuCkqVksuxUeoYxm8KRZx76cA';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);