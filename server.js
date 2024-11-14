import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// Ensure SUPABASE_URL and SUPABASE_ANON_KEY are loaded
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY. Exiting...");
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Register route
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json({ success: true, user: data.user });
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json({ success: true, user: data.user, session: data.session }); // Send back session token
});

// Save game data
app.post('/api/saveGameData', async (req, res) => {
    const { user_id, cash, cashPerClick, cashPerSecond, highestCash, netCash, totalHoursPlayed } = req.body;
    const { error } = await supabase.from('game_data').upsert([
        { user_id, cash, cash_per_click: cashPerClick, cash_per_second: cashPerSecond, highest_cash: highestCash, net_cash: netCash, total_hours_played: totalHoursPlayed }
    ]);
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json({ success: true });
});

// Load game data
app.get('/api/loadGameData', async (req, res) => {
    const { user_id } = req.query;
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
