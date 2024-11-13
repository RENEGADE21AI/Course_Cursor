// supabase.js (Place this in your public folder)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
