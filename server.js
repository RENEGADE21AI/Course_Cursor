import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// Ensure SUPABASE_URL and SUPABASE_ANON_KEY are loaded
console.log("Supabase URL:", process.env.SUPABASE_URL);
console.log("Supabase Key:", process.env.SUPABASE_ANON_KEY ? "Key loaded" : "No key loaded");

// Check if the necessary environment variables are set
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY. Exiting...");
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get the directory name of the current module (replaces __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, JS, CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Register a new user
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json({ success: true, user: data.user });
});

// Login an existing user
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json({ success: true, user: data.user });
});

// Save game data to the database
app.post('/api/saveGameData', async (req, res) => {
    const { user_id, cash, cashPerClick, cashPerSecond, highestCash, netCash, totalHoursPlayed } = req.body;

    // Ensure the user is authenticated before saving data
    const { data: userSession, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !userSession) {
        return res.json({ success: false, message: 'User not authenticated. Please login.' });
    }

    // Save the game data to the database
    const { error } = await supabase.from('game_data').upsert([
        { user_id, cash, cash_per_click: cashPerClick, cash_per_second: cashPerSecond, highest_cash: highestCash, net_cash: netCash, total_hours_played: totalHoursPlayed }
    ]);
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json({ success: true });
});

// Load game data from the database
app.get('/api/loadGameData', async (req, res) => {
    const { user_id } = req.query;

    // Ensure the user is authenticated before loading data
    const { data: userSession, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !userSession) {
        return res.json({ success: false, message: 'User not authenticated. Please login.' });
    }

    // Fetch the user's game data
    const { data, error } = await supabase.from('game_data').select('*').eq('user_id', user_id).single();
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json(data);
});

// Use dynamic port from environment or fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
