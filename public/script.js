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
const upgradeContainer = document.getElementById('upgradeContainer');
const accountOverlay = document.getElementById('accountOverlay');
const accountMessage = document.getElementById('accountMessage');
const accountActionButton = document.getElementById('accountActionButton');
const logoutButton = document.getElementById('logoutButton');
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

let currentUser = null;
let upgradeData = [];

// Function to update displayed stats
function updateDisplay() {
    scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
}

// Load game data from local storage for unauthenticated users
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

// Save game data to local storage for unauthenticated users
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

// Save game data to Supabase for authenticated users
async function saveGameData() {
    if (!currentUser) return;
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

// Load game data from Supabase for authenticated users
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

// Fetch and render upgrades
async function loadUpgrades() {
    try {
        const response = await fetch('https://course-cursor.onrender.com/api/upgrades');
        upgradeData = await response.json();
        renderUpgrades();
    } catch (error) {
        console.error("Error loading upgrades:", error);
    }
}

// Render upgrades dynamically
function renderUpgrades() {
    upgradeContainer.innerHTML = '';
    upgradeData.forEach(upgrade => {
        const button = document.createElement('button');
        button.textContent = `${upgrade.name} - Cost: $${upgrade.cost}`;
        button.addEventListener('click', () => {
            if (cash >= upgrade.cost) {
                cash -= upgrade.cost;
                cashPerClick += upgrade.increment.click || 0;
                cashPerSecond += upgrade.increment.automatic || 0;
                updateDisplay();
                if (!currentUser) saveLocalGameData();
            }
        });
        upgradeContainer.appendChild(button);
    });
}

// Increment cash on click
clickCash.addEventListener('click', () => {
    cash += cashPerClick;
    if (cash > highestCash) highestCash = cash;
    netCash += cashPerClick;
    updateDisplay();
    if (!currentUser) saveLocalGameData();
});

// Automatically increment cash per second
setInterval(() => {
    cash += cashPerSecond;
    if (cash > highestCash) highestCash = cash;
    netCash += cashPerSecond;
    updateDisplay();
    if (!currentUser) saveLocalGameData();
}, 1000);

// Handle account overlay display
function updateAccountOverlay() {
    if (currentUser) {
        accountMessage.textContent = `You are Logged in as ${currentUser.username}`;
        accountActionButton.textContent = 'Logout';
        accountActionButton.onclick = handleLogout;
    } else {
        accountMessage.textContent = 'You are Not Logged in';
        accountActionButton.textContent = 'Login/Register';
        accountActionButton.onclick = () => {
            accountOverlay.style.display = 'none';
            loginForm.style.display = 'block';
        };
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    try {
        const { data, error } = await fetch('https://course-cursor.onrender.com/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
        }).then(res => res.json());
        if (error) throw error;
        currentUser = data.user;
        await loadGameData();
        loginForm.style.display = 'none';
        updateAccountOverlay();
    } catch (error) {
        console.error("Login error:", error);
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    try {
        const { data, error } = await fetch('https://course-cursor.onrender.com/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
        }).then(res => res.json());
        if (error) throw error;
        alert("Registration successful! You can now log in.");
    } catch (error) {
        console.error("Registration error:", error);
    }
}

// Handle logout
async function handleLogout() {
    if (currentUser) {
        await saveGameData();
        currentUser = null;
        updateAccountOverlay();
    }
    saveLocalGameData();
    accountOverlay.style.display = 'none';
}

// Initialize the game
function initializeGame() {
    if (!currentUser) {
        loadLocalGameData();
    } else {
        loadGameData();
    }
    loadUpgrades();
    updateAccountOverlay();
}

// Schedule periodic saves
setInterval(() => {
    if (currentUser) {
        saveGameData();
    } else {
        saveLocalGameData();
    }
}, 60000);

// Save data on unload
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        saveGameData();
    } else {
        saveLocalGameData();
    }
});

// Load game on startup
initializeGame();

console.log("Game script initialized!");
