import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json({ success: true, user: data.user });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json({ success: true, user: data.user });
});

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

app.get('/api/loadGameData', async (req, res) => {
    const { user_id } = req.query;
    const { data, error } = await supabase.from('game_data').select('*').eq('user_id', user_id).single();
    if (error) {
        return res.json({ success: false, message: error.message });
    }
    res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
