// app/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kzdfeibrydvpwyltcynm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6ZGZlaWJyeWR2cHd5bHRjeW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjU2NjMsImV4cCI6MjA5NzQ0MTY2M30.JbID_8AJlF9KzXorTDAdlDJmZro3omkPQtlB7xiV_74';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);