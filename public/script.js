console.log("script.js loaded!");

// Supabase initialization (already in your project setup)
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
const upgradeClick = document.getElementById('upgradeClick');
const upgradeAutomatic = document.getElementById('upgradeAutomatic');
const loginRegisterOverlay = document.getElementById('loginRegisterOverlay');
const logoutButton = document.getElementById('logoutButton');

let currentUser = null;

// Function to update displayed stats
function updateDisplay() {
    scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
    // Update other UI elements here, e.g., upgrade costs, stats overlays, etc.
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
        totalHoursPlayed
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
            total_hours_played: totalHoursPlayed
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

// Upgrade click value
upgradeClick.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
        cash -= upgradeClickCost;
        cashPerClick += 0.10;
        upgradeClickCost *= 1.2;
        updateDisplay();
        if (!currentUser) saveLocalGameData();
    }
});

// Upgrade automatic income
upgradeAutomatic.addEventListener('click', () => {
    if (cash >= upgradeAutomaticCost) {
        cash -= upgradeAutomaticCost;
        cashPerSecond += 0.05;
        upgradeAutomaticCost *= 1.2;
        updateDisplay();
        if (!currentUser) saveLocalGameData();
    }
});

// Logout and save game data
logoutButton.addEventListener('click', async () => {
    if (currentUser) {
        await saveGameData();
        currentUser = null;
    } else {
        saveLocalGameData();
    }
    loginRegisterOverlay.style.display = 'flex';
});

// Load game data on page load
if (!currentUser) {
    loadLocalGameData();
} else {
    loadGameData();
}

// Save game data every minute
setInterval(() => {
    if (currentUser) {
        saveGameData();
    } else {
        saveLocalGameData();
    }
}, 60000);

// Save game data before unloading the page
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        saveGameData();
    } else {
        saveLocalGameData();
    }
});

console.log("Game script initialized!");
