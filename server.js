import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';

// Load environment variables
dotenv.config();

// Ensure required environment variables are present
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.JWT_SECRET) {
    console.error('Missing required environment variables. Exiting...');
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://course-cursor.onrender.com',
];
app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    })
);

// Logging middleware
app.use(morgan(process.env.NODE_ENV !== 'production' ? 'dev' : 'combined'));

// Rate limiting middleware
const accountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', accountLimiter);

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Helper function for Supabase queries
async function supabaseQuery(queryFn) {
    const { data, error } = await queryFn();
    if (error) {
        console.error('Supabase error:', error.message);
        throw new Error(error.message);
    }
    return data;
}

// Validation schemas
const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

const gameDataSchema = Joi.object({
    cash: Joi.number().required(),
    cashPerClick: Joi.number().required(),
    cashPerSecond: Joi.number().required(),
    highestCash: Joi.number().required(),
    netCash: Joi.number().required(),
    totalHoursPlayed: Joi.number().required(),
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.status(500).send('Error loading index.html');
        }
    });
});

app.post('/api/register', async (req, res) => {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { username, password } = req.body;
    try {
        const existingUser = await supabaseQuery(() =>
            supabase.from('users').select('*').eq('username', username).single()
        );
        if (existingUser) return res.status(400).json({ success: false, message: 'Username already taken.' });

        const { data, error } = await supabase.auth.signUp({ username, password });
        if (error) throw error;

        res.json({ success: true, user: { id: data.user.id, username: data.user.username } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { username, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ username, password });
        if (error) throw error;
        res.json({ success: true, user: { id: data.user.id, username: data.user.username } });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.post('/api/saveGameData', async (req, res) => {
    const { error } = gameDataSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { id: user_id } = req.body;
    const { cash, cashPerClick, cashPerSecond, highestCash, netCash, totalHoursPlayed } = req.body;

    try {
        await supabaseQuery(() =>
            supabase.from('game_data').upsert({
                user_id,
                cash,
                cash_per_click: cashPerClick,
                cash_per_second: cashPerSecond,
                highest_cash: highestCash,
                net_cash: netCash,
                total_hours_played: totalHoursPlayed,
            })
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/loadGameData', async (req, res) => {
    const { id: user_id } = req.body;

    try {
        const data = await supabaseQuery(() =>
            supabase.from('game_data').select('*').eq('user_id', user_id).single()
        );
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
