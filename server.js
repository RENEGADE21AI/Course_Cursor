// server.js
const express = require('express');
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000; // Default to 3000 if no PORT is set
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Root route for testing purposes (shows server is running)
app.get('/', (req, res) => {
    res.send('Welcome to Course Cursor!');
});

// User registration route
app.post('/api/auth/register', async (req, res) => {
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from('users')
        .insert([{ email, password: hashedPassword, username }]);

    if (error) {
        res.status(400).json({ error: error.message });
    } else {
        res.json({ message: 'User registered successfully!' });
    }
});

// User login route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !data || !(await bcrypt.compare(password, data.password))) {
        res.status(401).json({ error: 'Invalid credentials' });
    } else {
        res.json({ message: 'Logged in successfully!', user_id: data.id });
    }
});

// Serve static files (e.g., your front-end files like HTML, CSS, JS)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
