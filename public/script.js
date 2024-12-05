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
const accountOverlay = document.getElementById('accountOverlay');
const resetConfirmationOverlay = document.getElementById('resetConfirmationOverlay');
const highestCashDisplay = document.getElementById('highestCash');
const netCashDisplay = document.getElementById('netCash');
const hoursPlayedDisplay = document.getElementById('hoursPlayed');
const statsButton = document.getElementById('statsButton');
const settingsButton = document.getElementById('settingsButton');
const accountButton = document.getElementById('accountButton');
const resetProgressButton = document.getElementById('resetProgressButton');
const closeStats = document.getElementById('closeStats');
const closeSettings = document.getElementById('closeSettings');
const closeAccount = document.getElementById('closeAccount');
const closeResetConfirmation = document.getElementById('closeResetConfirmation');
const confirmResetButton = document.getElementById('confirmResetButton');
const cancelResetButton = document.getElementById('cancelResetButton');

// Current user
let currentUser = null;

// Function to update displayed stats
function updateDisplay() {
    scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
    clickInfo.textContent = `Current Cash Per Click: $${cashPerClick.toFixed(2)}`;
    automaticInfo.textContent = `Current Cash Per Second: $${cashPerSecond.toFixed(2)}`;
    upgradeClickButton.textContent = `Buy More Cash Per Click (Cost: $${upgradeClickCost.toFixed(2)})`;
    upgradeAutomaticButton.textContent = `Buy More Cash Per Second (Cost: $${upgradeAutomaticCost.toFixed(2)})`;
    highestCashDisplay.textContent = highestCash.toFixed(2);
    netCashDisplay.textContent = netCash.toFixed(2);
    hoursPlayedDisplay.textContent = (totalHoursPlayed / 3600).toFixed(2);
}

// Handle upgrades
upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
        cash -= upgradeClickCost;
        cashPerClick = Math.ceil(cashPerClick * 1.15 * 100) / 100;
        upgradeClickCost = Math.ceil(upgradeClickCost * 1.25 * 100) / 100;
        updateDisplay();
        saveProgress();
    }
});

upgradeAutomaticButton.addEventListener('click', () => {
    if (cash >= upgradeAutomaticCost) {
        cash -= upgradeAutomaticCost;
        cashPerSecond = Math.ceil(cashPerSecond * 1.15 * 100) / 100;
        upgradeAutomaticCost = Math.ceil(upgradeAutomaticCost * 1.25 * 100) / 100;
        updateDisplay();
        saveProgress();
    }
});

// Increment cash on click
clickCash.addEventListener('click', () => {
    cash += cashPerClick;
    netCash += cashPerClick;
    highestCash = Math.max(highestCash, cash);
    updateDisplay();
    saveProgress();
    // Animation effect
    clickCash.style.transform = 'scale(1.1)';
    setTimeout(() => {
        clickCash.style.transform = 'scale(1)';
    }, 100);
});

// Automatically increment cash per second
setInterval(() => {
    cash += cashPerSecond;
    netCash += cashPerSecond;
    highestCash = Math.max(highestCash, cash);
    totalHoursPlayed += 1 / 3600;
    updateDisplay();
    saveProgress();
}, 1000);

// Handle pop-ups
settingsButton.addEventListener('click', () => {
    settingsOverlay.style.display = 'flex';
});

closeSettings.addEventListener('click', () => {
    settingsOverlay.style.display = 'none';
});

statsButton.addEventListener('click', () => {
    statsOverlay.style.display = 'flex';
});

closeStats.addEventListener('click', () => {
    statsOverlay.style.display = 'none';
});

// Open Account pop-up
accountButton.addEventListener('click', () => {
    accountOverlay.style.display = 'flex';
});

// Close Account pop-up
closeAccount.addEventListener('click', () => {
    accountOverlay.style.display = 'none';
});

// Open Reset Confirmation pop-up
resetProgressButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'flex';
});

// Close Reset Confirmation pop-up
closeResetConfirmation.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});

// Confirm Reset Progress
confirmResetButton.addEventListener('click', () => {
    cash = 0;
    cashPerClick = 0.50;
    cashPerSecond = 0.25;
    upgradeClickCost = 10.00;
    upgradeAutomaticCost = 10.00;
    highestCash = 0;
    netCash = 0;
    totalHoursPlayed = 0;

    if (currentUser) {
        resetGameDataOnServer();
    } else {
        localStorage.removeItem('gameData');
    }

    updateDisplay();
    resetConfirmationOverlay.style.display = 'none';
});

// Cancel Reset Progress
cancelResetButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});

// Save game data locally or to the server based on user authentication
function saveProgress() {
    if (currentUser) {
        saveGameData();
    } else {
        saveLocalGameData();
    }
}

// Save game data to the server
async function saveGameData() {
    const { data, error } = await supabase
        .from('game_data')
        .upsert({
            user_id: currentUser.id,
            cash,
            cash_per_click: cashPerClick,
            cash_per_second: cashPerSecond,
            highest_cash: highestCash,
            net_cash: netCash,
            total_hours_played: totalHoursPlayed
        });

    if (error) {
        console.error('Error saving game data:', error);
    } else {
        console.log('Game data saved successfully');
    }
}

// Save game data locally
function saveLocalGameData() {
    const gameData = { cash, cashPerClick, cashPerSecond, upgradeClickCost, upgradeAutomaticCost, highestCash, netCash, totalHoursPlayed };
    localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Load game data locally or from the server based on user authentication
async function loadGameData() {
    if (currentUser) {
        const { data, error } = await supabase
            .from('game_data')
            .select()
            .eq('user_id', currentUser.id)
            .single();

        if (error) {
            console.error('Error loading game data:', error);
        } else if (data) {
            cash = data.cash || 0;
            cashPerClick = data.cash_per_click || 0.50;
            cashPerSecond = data.cash_per_second || 0.25;
            highestCash = data.highest_cash || 0;
            netCash = data.net_cash || 0;
            totalHoursPlayed = data.total_hours_played || 0;
        }
    } else {
        loadLocalGameData();
    }

    updateDisplay();
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
    }
    updateDisplay();
}

// Load the saved game data when the page loads
loadGameData();
