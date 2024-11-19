import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import Joi from 'joi';

// Load environment variables from .env file
dotenv.config();

// Check environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables. Exiting...');
    process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate limiting middleware
const accountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', accountLimiter);

// Get the directory name (replaces __dirname in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, JS, CSS, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions for backend queries
async function supabaseQuery(queryFn) {
    const { data, error } = await queryFn();
    if (error) {
        console.error('Supabase error:', error.message);
        throw new Error(error.message);
    }
    return data;
}

async function checkDeviceAccountLimit(deviceId) {
    const data = await supabaseQuery(() =>
        supabase.from('user_creation_logs').select('*').eq('device_id', deviceId)
    );
    return data.length >= 3;
}

async function checkIpAccountLimit(ipAddress) {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const data = await supabaseQuery(() =>
        supabase
            .from('user_creation_logs')
            .select('*')
            .eq('ip_address', ipAddress)
            .gt('created_at', oneMonthAgo.toISOString())
    );
    return data.length >= 10;
}

function getDeviceId(req, res) {
    let deviceId = req.cookies?.device_id;
    if (!deviceId) {
        deviceId = crypto.randomBytes(16).toString('hex');
        res.cookie('device_id', deviceId, {
            maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
        });
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

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
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
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, password } = req.body;
    const ipAddress = req.ip;
    const deviceId = getDeviceId(req, res);

    try {
        if (await checkDeviceAccountLimit(deviceId)) {
            return res.status(400).json({ success: false, message: 'Device limit reached.' });
        }

        if (await checkIpAccountLimit(ipAddress)) {
            return res.status(400).json({ success: false, message: 'IP address limit reached.' });
        }

        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        await supabaseQuery(() =>
            supabase.from('user_creation_logs').insert({ ip_address: ipAddress, device_id: deviceId })
        );

        res.json({ success: true, user: { id: data.user.id, email: data.user.email } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        res.json({ success: true, user: { id: data.user.id, email: data.user.email } });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

app.post('/api/saveGameData', verifyToken, async (req, res) => {
    const { error } = gameDataSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { id: user_id } = req.user;
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

app.get('/api/loadGameData', verifyToken, async (req, res) => {
    const { id: user_id } = req.user;

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
