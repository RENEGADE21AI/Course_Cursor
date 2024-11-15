import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000', // Development origin
    'https://course-cursor.onrender.com', // Production frontend domain
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    })
);

// Check environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Missing SUPABASE_URL or SUPABASE_ANON_KEY. Exiting...');
    process.exit(1);
}

if (process.env.NODE_ENV === 'development') {
    console.log('Supabase URL:', process.env.SUPABASE_URL);
    console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY ? 'Key loaded' : 'No key loaded');
}

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get the directory name (replaces __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, JS, CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to verify Supabase JWT
async function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided.' });
    }

    try {
        const { data: user, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            throw new Error('Invalid or expired token.');
        }
        req.user = user; // Attach user data to the request
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Unauthorized: ' + err.message });
    }
}

// Route to serve index.html at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.status(500).send('Error loading index.html');
        }
    });
});

// API endpoints
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        res.json({ success: true, user: data.user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        res.json({ success: true, user: data.user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.post('/api/saveGameData', verifyToken, async (req, res) => {
    const { id: user_id } = req.user; // Authenticated user ID
    const { cash, cashPerClick, cashPerSecond, highestCash, netCash, totalHoursPlayed } = req.body;

    try {
        const { error } = await supabase
            .from('game_data')
            .upsert({
                user_id,
                cash,
                cash_per_click: cashPerClick,
                cash_per_second: cashPerSecond,
                highest_cash: highestCash,
                net_cash: netCash,
                total_hours_played: totalHoursPlayed,
            });
        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to save game data: ' + err.message });
    }
});

app.get('/api/loadGameData', verifyToken, async (req, res) => {
    const { id: user_id } = req.user; // Authenticated user ID

    try {
        const { data, error } = await supabase
            .from('game_data')
            .select('*')
            .eq('user_id', user_id)
            .single();
        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load game data: ' + err.message });
    }
});

// Use dynamic port from environment or fallback to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
