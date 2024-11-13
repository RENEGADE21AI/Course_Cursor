const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Root route that serves index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// User registration route
app.post('/api/auth/register', async (req, res) => {
    const { email, password, username } = req.body;

    try {
        // Create a new user in Supabase Auth
        const { user, error: authError } = await supabase.auth.signUp({ email, password });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        // Insert user details into the 'users' table
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, username, user_id: user.id }]);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        return res.json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration', message: error.message });
    }
});

// User login route
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sign in the user with Supabase Auth
        const { user, error: authError } = await supabase.auth.signInWithPassword({ email, password });

        if (authError || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Get user data from the 'users' table
        const { data, error: dbError } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', user.id)
            .single();

        if (dbError || !data) {
            return res.status(400).json({ error: 'User data not found' });
        }

        return res.json({ message: 'Logged in successfully!', user_id: user.id, user_data: data });
    } catch (error) {
        return res.status(500).json({ error: 'Server error during login', message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
