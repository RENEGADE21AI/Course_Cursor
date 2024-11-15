import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';  // For generating unique device IDs

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

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get the directory name (replaces __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, JS, CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions for checking account creation limits
async function checkDeviceAccountLimit(deviceId) {
    const { data, error } = await supabase
        .from('user_creation_logs')
        .select('*')
        .eq('device_id', deviceId);

    return error ? false : data.length >= 3;
}

async function checkIpAccountLimit(ipAddress) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { data, error } = await supabase
        .from('user_creation_logs')
        .select('*')
        .eq('ip_address', ipAddress)
        .gt('created_at', oneMonthAgo.toISOString());

    return error ? false : data.length >= 10;
}

// Generate a unique device ID (stored in a cookie)
function getDeviceId(req, res) {
    let deviceId = req.cookies.device_id;
    if (!deviceId) {
        deviceId = crypto.randomBytes(16).toString('hex');
        res.cookie('device_id', deviceId, { maxAge: 1000 * 60 * 60 * 24 * 365 }); // 1 year cookie
    }
    return deviceId;
}

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
    const ipAddress = req.ip;
    const deviceId = getDeviceId(req, res); // Get or create a device ID from cookie

    // Check if the user has exceeded the account limit for the device
    if (await checkDeviceAccountLimit(deviceId)) {
        return res.json({ success: false, message: 'You can only create 3 accounts per device.' });
    }

    // Check if the user has exceeded the account limit for the IP address
    if (await checkIpAccountLimit(ipAddress)) {
        return res.json({ success: false, message: 'You can only create 10 accounts per month per IP address.' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // Log the account creation (for tracking purposes)
        await supabase.from('user_creation_logs').insert({
            ip_address: ipAddress,
            device_id: deviceId,
        });

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
