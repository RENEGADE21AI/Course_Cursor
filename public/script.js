// Game variables
let cash = 0;
let cashPerClick = 0.50;
let cashPerSecond = 0.25;
let upgradeClickCost = 10.00;
let upgradeAutomaticCost = 10.00;
let highestCash = 0;
let netCash = 0;
let totalHoursPlayed = 0;

// HTML element references
const clickCash = document.getElementById('clickCash');
const scoreDisplay = document.getElementById('scoreDisplay');
const upgradeClickButton = document.getElementById('upgradeClickButton');
const upgradeAutomaticButton = document.getElementById('upgradeAutomaticButton');
const clickInfo = document.getElementById('clickInfo');
const automaticInfo = document.getElementById('automaticInfo');
const settingsOverlay = document.getElementById('settingsOverlay');
const statsOverlay = document.getElementById('statsOverlay');
const closeSettings = document.getElementById('closeSettings');
const closeStats = document.getElementById('closeStats');
const resetProgressButton = document.getElementById('resetProgressButton');
const resetConfirmationOverlay = document.getElementById('resetConfirmationOverlay');
const closeResetConfirmation = document.getElementById('closeResetConfirmation');
const confirmResetButton = document.getElementById('confirmResetButton');
const cancelResetButton = document.getElementById('cancelResetButton');
const highestCashDisplay = document.getElementById('highestCash');
const netCashDisplay = document.getElementById('netCash');
const hoursPlayedDisplay = document.getElementById('hoursPlayed');

// Login/Register modal elements
const loginRegisterOverlay = document.getElementById('loginRegisterOverlay');
const closeLoginRegister = document.getElementById('closeLoginRegister');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const logoutButton = document.getElementById('logoutButton');

// Supabase authentication setup
const supabaseUrl = 'https://your-project-id.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'your-anon-key'; // Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to update the display based on game state
function updateDisplay() {
    scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
    clickInfo.textContent = `Current Cash Per Click: $${cashPerClick.toFixed(2)}`;
    automaticInfo.textContent = `Current Cash Per Second: $${cashPerSecond.toFixed(2)}`;
    upgradeClickButton.textContent = `Buy More Cash Per Click (Cost: $${upgradeClickCost.toFixed(2)})`;
    upgradeAutomaticButton.textContent = `Buy More Cash Per Second (Cost: $${upgradeAutomaticCost.toFixed(2)})`;
    highestCashDisplay.textContent = highestCash.toFixed(2);
    netCashDisplay.textContent = netCash.toFixed(2);
    hoursPlayedDisplay.textContent = totalHoursPlayed.toFixed(2);
}

// Function to save game state to localStorage and Supabase
function saveGameState(user_id) {
    localStorage.setItem('gameState', JSON.stringify({
        cash, cashPerClick, cashPerSecond, upgradeClickCost, upgradeAutomaticCost, highestCash, netCash, totalHoursPlayed
    }));

    // Save to database under user_id
    fetch('/api/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id,
            cash,
            cash_per_click: cashPerClick,
            cash_per_second: cashPerSecond,
            highest_cash: highestCash,
            net_cash: netCash,
            total_hours_played: totalHoursPlayed
        })
    });
}

// Login function
loginButton.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        alert('Error logging in: ' + error.message);
    } else {
        alert('Logged in successfully!');
        loginRegisterOverlay.style.display = 'none';
        loadUserData(user.id); // Load user's game data
    }
});

// Register function
registerButton.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    const { user, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        alert('Error registering: ' + error.message);
    } else {
        alert('Registered successfully!');
        loginRegisterOverlay.style.display = 'none';
        loadUserData(user.id); // Load user's game data
    }
});

// Load user's game data from Supabase
async function loadUserData(user_id) {
    const { data, error } = await supabase
        .from('game_data')
        .select('*')
        .eq('user_id', user_id)
        .single();

    if (error) {
        alert('Error loading game data: ' + error.message);
    } else {
        cash = data.cash;
        cashPerClick = data.cash_per_click;
        cashPerSecond = data.cash_per_second;
        highestCash = data.highest_cash;
        netCash = data.net_cash;
        totalHoursPlayed = data.total_hours_played;
        updateDisplay();
    }
}

// Logout function
logoutButton.addEventListener('click', async () => {
    await supabase.auth.signOut();
    alert('Logged out successfully');
    cash = 0;
    updateDisplay();
    localStorage.removeItem('gameState');
});

// Show login/register modal
document.getElementById('loginRegisterButton').onclick = function () {
    loginRegisterOverlay.style.display = 'flex';
};

// Hide login/register modal
closeLoginRegister.onclick = function () {
    loginRegisterOverlay.style.display = 'none';
};

// Game click and upgrade functionality
clickCash.addEventListener('click', () => {
    cash += cashPerClick;
    highestCash = Math.max(highestCash, cash);
    netCash += cashPerClick;
    updateDisplay();
    clickCash.style.transform = 'scale(1.1)';
    setTimeout(() => {
        clickCash.style.transform = 'scale(1)';
    }, 100);
});

upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
        cash -= upgradeClickCost;
        cashPerClick = Math.ceil(cashPerClick * 1.15 * 100) / 100;
        upgradeClickCost = Math.ceil(upgradeClickCost * 1.15 * 100) / 100;
        updateDisplay();
    }
});

upgradeAutomaticButton.addEventListener('click', () => {
    if (cash >= upgradeAutomaticCost) {
        cash -= upgradeAutomaticCost;
        cashPerSecond = Math.ceil(cashPerSecond * 1.15 * 100) / 100;
        upgradeAutomaticCost = Math.ceil(upgradeAutomaticCost * 1.15 * 100) / 100;
        updateDisplay();
    }
});

// Periodically add cash per second
setInterval(() => {
    cash += cashPerSecond;
    highestCash = Math.max(highestCash, cash);
    netCash += cashPerSecond;
    totalHoursPlayed += 1 / 3600;
    updateDisplay();
}, 1000);

// Load saved state from localStorage on window load
window.onload = () => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const { cash: savedCash, cashPerClick: savedCashPerClick, cashPerSecond: savedCashPerSecond, upgradeClickCost: savedUpgradeClickCost, upgradeAutomaticCost: savedUpgradeAutomaticCost, highestCash: savedHighestCash, netCash: savedNetCash, totalHoursPlayed: savedTotalHoursPlayed } = JSON.parse(savedState);
        cash = savedCash;
        cashPerClick = savedCashPerClick;
        cashPerSecond = savedCashPerSecond;
        upgradeClickCost = savedUpgradeClickCost;
        upgradeAutomaticCost = savedUpgradeAutomaticCost;
        highestCash = savedHighestCash;
        netCash = savedNetCash;
        totalHoursPlayed = savedTotalHoursPlayed;
        updateDisplay();
    }
};

// Save game state every 1 second
setInterval(() => {
    const user = supabase.auth.user();
    if (user) {
        saveGameState(user.id);
    }
}, 1000);
// Open the login/register pop-up when Login/Register button is clicked
document.getElementById("loginRegisterButton").onclick = function () {
    document.getElementById("loginRegisterOverlay").style.display = "flex";
};

// Close the login/register pop-up
document.getElementById("closeLoginRegister").onclick = function () {
    document.getElementById("loginRegisterOverlay").style.display = "none";
};

// Function to handle login
async function handleLogin() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const message = document.getElementById("loginRegisterMessage");

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    if (result.error) {
        message.textContent = result.error;
    } else {
        message.textContent = "Logged in successfully!";
        // Load game data here based on user ID
    }
}

// Function to handle registration
async function handleRegister() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const username = document.getElementById("usernameInput").value;
    const message = document.getElementById("loginRegisterMessage");

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
    });

    const result = await response.json();
    if (result.error) {
        message.textContent = result.error;
    } else {
        message.textContent = "Registered successfully! Please log in.";
    }
}

document.getElementById("loginButton").addEventListener("click", handleLogin);
document.getElementById("registerButton").addEventListener("click", handleRegister);
