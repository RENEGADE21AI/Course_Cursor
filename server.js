console.log('Starting server...');

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';

// Load environment variables
dotenv.config();

// Ensure required environment variables are present
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_JWT_SECRET'];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    }
});

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cookieParser());

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://course-cursor.onrender.com'];
app.use(cors({ origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true }));

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting middleware
const strictLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Too many attempts. Please try again later.' },
});
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/register', strictLimiter);
app.use('/api/login', strictLimiter);
app.use('/api/', generalLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d' }));

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
const schemas = {
    register: Joi.object({
        username: Joi.string().alphanum().min(3).max(20).required(),
        password: Joi.string()
            .pattern(new RegExp('^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$'))
            .required()
            .messages({
                'string.pattern.base': 'Password must include an uppercase letter, a number, and a special character.',
            }),
    }),
    login: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }),
    gameData: Joi.object({
        cash: Joi.number().required(),
        cashPerClick: Joi.number().required(),
        cashPerSecond: Joi.number().required(),
        highestCash: Joi.number().required(),
        netCash: Joi.number().required(),
        totalHoursPlayed: Joi.number().required(),
    }),
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) res.status(500).send('Error loading index.html');
    });
});

// Register route
app.post('/api/register', async (req, res) => {
    const { error } = schemas.register.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { username, password } = req.body;
    try {
        // Check if username already exists
        const existingUser = await supabaseQuery(() =>
            supabase.from('users').select('*').eq('username', username).single()
        );
        if (existingUser) return res.status(400).json({ success: false, message: 'Username already taken.' });

        // Sign up with dummy email
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: `${username}@example.com`, // Use a dummy email
            password,
        });
        if (signUpError) throw signUpError;

        // Store user details in 'users' table
        await supabaseQuery(() =>
            supabase.from('users').upsert({
                id: data.user.id,
                username,
            })
        );

        res.json({ success: true, user: { id: data.user.id, username } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { error } = schemas.login.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { username, password } = req.body;
    try {
        // Check if user exists by username
        const user = await supabaseQuery(() =>
            supabase.from('users').select('id, username').eq('username', username).single()
        );
        if (!user) return res.status(400).json({ success: false, message: 'Username not found.' });

        // Sign in with dummy email
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email: `${username}@example.com`, // Use a dummy email
            password,
        });
        if (signInError) throw signInError;

        res.json({ success: true, user: { id: data.user.id, username: user.username } });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Save game data
app.post('/api/saveGameData', async (req, res) => {
    const { error } = schemas.gameData.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const { id: user_id, ...gameData } = req.body;
    try {
        await supabaseQuery(() =>
            supabase.from('game_data').upsert({ user_id, ...gameData })
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Load game data
app.get('/api/loadGameData', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ success: false, message: 'User ID is required.' });

    try {
        const data = await supabaseQuery(() =>
            supabase.from('game_data').select('*').eq('user_id', user_id).single()
        );
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
