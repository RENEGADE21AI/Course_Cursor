console.log("script.js loaded!");

// Supabase initialization
const supabase = window.supabase;

// Variables to manage game state
let cash = 0;
let cashPerClick = 0.50;
let cashPerSecond = 0.25;
let upgradeClickCost = 10.00;
let upgradeAutomaticCost = 10.00;
let highestCash = 0;
let netCash = 0;
let totalHoursPlayed = 0;

// DOM element references
const clickCash = document.getElementById('clickCash');
const scoreDisplay = document.getElementById('scoreDisplay');
const upgradeClickButton = document.getElementById('upgradeClickButton');
const upgradeAutomaticButton = document.getElementById('upgradeAutomaticButton');
const clickInfo = document.getElementById('clickInfo');
const automaticInfo = document.getElementById('automaticInfo');
const statsOverlay = document.getElementById('statsOverlay');
const settingsOverlay = document.getElementById('settingsOverlay');
const loginRegisterOverlay = document.getElementById('loginRegisterOverlay');
const resetConfirmationOverlay = document.getElementById('resetConfirmationOverlay');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const confirmResetButton = document.getElementById('confirmResetButton');
const cancelResetButton = document.getElementById('cancelResetButton');
const highestCashDisplay = document.getElementById('highestCash');
const netCashDisplay = document.getElementById('netCash');
const hoursPlayedDisplay = document.getElementById('hoursPlayed');

// Current user
let currentUser = null;

// Function to update displayed stats
function updateDisplay() {
    scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
    clickInfo.textContent = `Current Cash Per Click: $${cashPerClick.toFixed(2)}`;
    automaticInfo.textContent = `Current Cash Per Second: $${cashPerSecond.toFixed(2)}`;
    highestCashDisplay.textContent = highestCash.toFixed(2);
    netCashDisplay.textContent = netCash.toFixed(2);
    hoursPlayedDisplay.textContent = (totalHoursPlayed / 3600).toFixed(2);
}

// Handle upgrades
upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
        cash -= upgradeClickCost;
        cashPerClick += 0.50;
        upgradeClickCost *= 1.25;
        updateDisplay();
        saveProgress();
    }
});

upgradeAutomaticButton.addEventListener('click', () => {
    if (cash >= upgradeAutomaticCost) {
        cash -= upgradeAutomaticCost;
        cashPerSecond += 0.25;
        upgradeAutomaticCost *= 1.25;
        updateDisplay();
        saveProgress();
    }
});

// Increment cash on click
clickCash.addEventListener('click', () => {
    cash += cashPerClick;
    netCash += cashPerClick;
    if (cash > highestCash) highestCash = cash;
    updateDisplay();
    saveProgress();
});

// Automatically increment cash per second
setInterval(() => {
    cash += cashPerSecond;
    netCash += cashPerSecond;
    if (cash > highestCash) highestCash = cash;
    updateDisplay();
    saveProgress();
}, 1000);

// Save game data locally
function saveLocalGameData() {
    const gameData = {
        cash,
        cashPerClick,
        cashPerSecond,
        upgradeClickCost,
        upgradeAutomaticCost,
        highestCash,
        netCash,
        totalHoursPlayed,
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Load game data locally
function loadLocalGameData() {
    const savedData = JSON.parse(localStorage.getItem('gameData'));
    if (savedData) {
        cash = savedData.cash || 0;
        cashPerClick = savedData.cashPerClick || 0.50;
        cashPerSecond = savedData.cashPerSecond || 0.25;
        upgradeClickCost = savedData.upgradeClickCost || 10.00;
        upgradeAutomaticCost = savedData.upgradeAutomaticCost || 10.00;
        highestCash = savedData.highestCash || 0;
        netCash = savedData.netCash || 0;
        totalHoursPlayed = savedData.totalHoursPlayed || 0;
        updateDisplay();
    }
}

// Save game data to Supabase
async function saveGameData() {
    if (!currentUser) {
        saveLocalGameData();
        return;
    }
    try {
        await supabase.from('game_data').upsert({
            user_id: currentUser.id,
            cash,
            cash_per_click: cashPerClick,
            cash_per_second: cashPerSecond,
            highest_cash: highestCash,
            net_cash: netCash,
            total_hours_played: totalHoursPlayed,
        });
    } catch (error) {
        console.error("Error saving game data:", error);
    }
}

// Load game data from Supabase
async function loadGameData() {
    if (!currentUser) return;
    try {
        const { data, error } = await supabase
            .from('game_data')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
        if (error) throw error;
        if (data) {
            cash = data.cash;
            cashPerClick = data.cash_per_click;
            cashPerSecond = data.cash_per_second;
            highestCash = data.highest_cash;
            netCash = data.net_cash;
            totalHoursPlayed = data.total_hours_played;
            updateDisplay();
        }
    } catch (error) {
        console.error("Error loading game data:", error);
    }
}

// Save progress (decides whether to save locally or to Supabase)
function saveProgress() {
    if (currentUser) {
        saveGameData();
    } else {
        saveLocalGameData();
    }
}

// Handle login
async function handleLogin() {
    try {
        const { user, error } = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json());
        if (error) throw error;
        currentUser = user;
        loadGameData();
        loginRegisterOverlay.style.display = 'none';
    } catch (error) {
        console.error("Login error:", error);
    }
}

// Handle registration
async function handleRegister() {
    try {
        const { error } = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
            headers: { 'Content-Type': 'application/json' },
        }).then(res => res.json());
        if (error) throw error;
        alert("Registration successful!");
    } catch (error) {
        console.error("Registration error:", error);
    }
}

// Reset confirmation
confirmResetButton.addEventListener('click', () => {
    localStorage.clear();
    cash = 0;
    cashPerClick = 0.50;
    cashPerSecond = 0.25;
    highestCash = 0;
    netCash = 0;
    totalHoursPlayed = 0;
    updateDisplay();
    resetConfirmationOverlay.style.display = 'none';
});

// Cancel reset
cancelResetButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});

// Initialize game
loadLocalGameData();
updateDisplay();
console.log("Game script initialized!");
