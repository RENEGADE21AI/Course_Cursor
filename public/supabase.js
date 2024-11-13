// supabase.js (Place this in your public folder)
const SUPABASE_URL = 'your-supabase-url';  // Replace with your actual Supabase URL
const SUPABASE_ANON_KEY = 'your-supabase-anon-key';  // Replace with your actual anon key

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
