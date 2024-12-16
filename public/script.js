// Variables to manage game state
let cash = 0;
let previousCash = cash; // Track the previous cash value
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
const clickCostDisplay = document.getElementById('clickCost');
const automaticCostDisplay = document.getElementById('automaticCost');
const statsOverlay = document.getElementById('statsOverlay');
const settingsOverlay = document.getElementById('settingsOverlay');
const accountOverlay = document.getElementById('accountOverlay');
const resetConfirmationOverlay = document.getElementById('resetConfirmationOverlay');
const soundtracksOverlay = document.getElementById('soundtracksOverlay');
const highestCashDisplay = document.getElementById('highestCash');
const netCashDisplay = document.getElementById('netCash');
const hoursPlayedDisplay = document.getElementById('hoursPlayed');
const statsButton = document.getElementById('statsButton');
const settingsButton = document.getElementById('settingsButton');
const accountButton = document.getElementById('accountSettingsButton');
const resetProgressButton = document.getElementById('resetProgressButton');
const soundtracksButton = document.getElementById('soundtracksButton');
const closeStats = document.getElementById('closeStats');
const closeSettings = document.getElementById('closeSettings');
const closeAccount = document.getElementById('closeAccount');
const closeResetConfirmation = document.getElementById('closeResetConfirmation');
const closeSoundtracks = document.getElementById('closeSoundtracks');
const confirmResetButton = document.getElementById('confirmResetButton');
const cancelResetButton = document.getElementById('cancelResetButton');

// Tab functionality for Soundtracks pop-up
const tabs = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));

        tab.classList.add('active');
        tabContents[index].classList.add('active');
    });
});

// Function to update displayed stats
function updateDisplay() {
    const cashElement = scoreDisplay;

    // Apply animation based on cash changes
    if (cash > previousCash) {
        cashElement.style.animation = "cashIncrease 0.3s ease-in-out";
    } else if (cash < previousCash) {
        cashElement.style.animation = "cashDecrease 0.3s ease-in-out";
    }

    // Reset animation after it's complete
    setTimeout(() => {
        cashElement.style.animation = "";
    }, 300);

    // Update the displayed cash value
    cashElement.textContent = `$${cash.toFixed(2)}`;

    // Update other values
    clickInfo.textContent = `Value: $${cashPerClick.toFixed(2)}`;
    automaticInfo.textContent = `Value: $${cashPerSecond.toFixed(2)}`;
    clickCostDisplay.textContent = `Cost: $${upgradeClickCost.toFixed(2)}`;
    automaticCostDisplay.textContent = `Cost: $${upgradeAutomaticCost.toFixed(2)}`;
    highestCashDisplay.textContent = highestCash.toFixed(2);
    netCashDisplay.textContent = netCash.toFixed(2);
    hoursPlayedDisplay.textContent = (totalHoursPlayed / 3600).toFixed(2);

    // Update the previous cash value
    previousCash = cash;
}

// Save game data locally
function saveLocalGameData() {
    localStorage.setItem('gameData', JSON.stringify({
        cash,
        cashPerClick,
        cashPerSecond,
        upgradeClickCost,
        upgradeAutomaticCost,
        highestCash,
        netCash,
        totalHoursPlayed
    }));
}

// Load game data from local storage
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

// Reset game progress
function resetGame() {
    cash = 0;
    cashPerClick = 0.50;
    cashPerSecond = 0.25;
    upgradeClickCost = 10.00;
    upgradeAutomaticCost = 10.00;
    highestCash = 0;
    netCash = 0;
    totalHoursPlayed = 0;

    saveLocalGameData();
    updateDisplay();
}

// Save data before the window is closed
window.addEventListener('beforeunload', () => {
    saveLocalGameData();
});

// Event listeners for game mechanics
upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
        cash -= upgradeClickCost;
        cashPerClick = Math.ceil(cashPerClick * 1.15 * 100) / 100;
        upgradeClickCost = Math.ceil(upgradeClickCost * 1.15 * 100) / 100; // Increase cost by 15%
        updateDisplay();
    }
});

upgradeAutomaticButton.addEventListener('click', () => {
    if (cash >= upgradeAutomaticCost) {
        cash -= upgradeAutomaticCost;
        cashPerSecond = Math.ceil(cashPerSecond * 1.15 * 100) / 100;
        upgradeAutomaticCost = Math.ceil(upgradeAutomaticCost * 1.15 * 100) / 100; // Increase cost by 15%
        updateDisplay();
    }
});

clickCash.addEventListener('click', () => {
    cash += cashPerClick;
    netCash += cashPerClick;
    highestCash = Math.max(highestCash, cash);
    updateDisplay();
});

setInterval(() => {
    cash += cashPerSecond;
    netCash += cashPerSecond;
    highestCash = Math.max(highestCash, cash);
    totalHoursPlayed += 1 / 3600;
    updateDisplay();
}, 1000);

// Save game data every 5 minutes
setInterval(() => {
    saveLocalGameData();
}, 300000);

// Pop-up handling
statsButton.addEventListener('click', () => {
    statsOverlay.style.display = 'flex';
});
closeStats.addEventListener('click', () => {
    statsOverlay.style.display = 'none';
});

settingsButton.addEventListener('click', () => {
    settingsOverlay.style.display = 'flex';
});
closeSettings.addEventListener('click', () => {
    settingsOverlay.style.display = 'none';
});

accountButton.addEventListener('click', () => {
    accountOverlay.style.display = 'flex';
});
closeAccount.addEventListener('click', () => {
    accountOverlay.style.display = 'none';
});

soundtracksButton.addEventListener('click', () => {
    soundtracksOverlay.style.display = 'flex';
});
closeSoundtracks.addEventListener('click', () => {
    soundtracksOverlay.style.display = 'none';
});

resetProgressButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'flex';
});
closeResetConfirmation.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});

confirmResetButton.addEventListener('click', () => {
    resetGame();
    resetConfirmationOverlay.style.display = 'none';
});

cancelResetButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});

// Load saved data on page load
loadLocalGameData();
