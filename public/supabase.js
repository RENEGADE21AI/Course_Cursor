import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Serve static files (if needed)
app.use(express.static('public'));

// Endpoint to provide the Supabase credentials securely
app.get('/api/supabase-credentials', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
