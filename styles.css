let cash = 0;
let cashPerClick = 0.50; // Set initial cash per click to $0.50
let cashPerSecond = 0.25; // Set initial cash per second to $0.25
let upgradeClickCost = 10.00; // Starting cost set to $10.00
let upgradeAutomaticCost = 10.00; // Starting cost set to $10.00
let highestCash = 0; // Track the highest amount of cash saved up
let netCash = 0; // Track net cash

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

function updateDisplay() {
    scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
    clickInfo.textContent = `Current Cash Per Click: $${cashPerClick.toFixed(2)}`;
    automaticInfo.textContent = `Current Cash Per Second: $${cashPerSecond.toFixed(2)}`;
    highestCashDisplay.textContent = highestCash.toFixed(2);
    netCashDisplay.textContent = netCash.toFixed(2);
    localStorage.setItem('gameState', JSON.stringify({ cash, cashPerClick, cashPerSecond, upgradeClickCost, upgradeAutomaticCost, highestCash, netCash }));
}

clickCash.addEventListener('click', () => {
    cash += cashPerClick;
    highestCash = Math.max(highestCash, cash); // Update highest cash if current cash is greater
    netCash += cashPerClick; // Increase net cash by cash per click
    updateDisplay();
    // Pulsing effect
    clickCash.style.transform = 'scale(1.1)';
    setTimeout(() => {
        clickCash.style.transform = 'scale(1)';
    }, 100);
});

upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
        cash -= upgradeClickCost;
        cashPerClick = Math.ceil(cashPerClick * 1.15 * 100) / 100; // Increase by 15%
        upgradeClickCost = Math.ceil(upgradeClickCost * 1.15 * 100) / 100; // Increase cost by 15%
        upgradeClickButton.textContent = `Buy More Cash Per Click (Cost: $${upgradeClickCost.toFixed(2)})`;
        updateDisplay();
    }
});

upgradeAutomaticButton.addEventListener('click', () => {
    if (cash >= upgradeAutomaticCost) {
        cash -= upgradeAutomaticCost;
        cashPerSecond = Math.ceil(cashPerSecond * 1.15 * 100) / 100; // Increase by 15%
        upgradeAutomaticCost = Math.ceil(upgradeAutomaticCost * 1.15 * 100) / 100; // Increase cost by 15%
        upgradeAutomaticButton.textContent = `Buy More Cash Per Second (Cost: $${upgradeAutomaticCost.toFixed(2)})`;
        updateDisplay();
    }
});

// Function to increment cash every second
setInterval(() => {
    cash += cashPerSecond;
    highestCash = Math.max(highestCash, cash); // Update highest cash if current cash is greater
    netCash += cashPerSecond; // Increase net cash by cash per second
    updateDisplay();
}, 1000);

// Load game state from localStorage
window.onload = () => {
    const savedState = localStorage.getItem('gameState');
    if (savedState) {
        const { cash: savedCash, cashPerClick: savedCashPerClick, cashPerSecond: savedCashPerSecond, upgradeClickCost: savedUpgradeClickCost, upgradeAutomaticCost: savedUpgradeAutomaticCost, highestCash: savedHighestCash, netCash: savedNetCash } = JSON.parse(savedState);
        cash = savedCash;
        cashPerClick = savedCashPerClick;
        cashPerSecond = savedCashPerSecond;
        upgradeClickCost = savedUpgradeClickCost;
        upgradeAutomaticCost = savedUpgradeAutomaticCost;
        highestCash = savedHighestCash;
        netCash = savedNetCash;
        updateDisplay();
        upgradeClickButton.textContent = `Buy More Cash Per Click (Cost: $${upgradeClickCost.toFixed(2)})`;
        upgradeAutomaticButton.textContent = `Buy More Cash Per Second (Cost: $${upgradeAutomaticCost.toFixed(2)})`;
    }
};

// Show settings overlay
document.getElementById('settingsButton').addEventListener('click', () => {
    settingsOverlay.style.display = 'flex';
});

// Close settings overlay
closeSettings.addEventListener('click', () => {
    settingsOverlay.style.display = 'none';
});

// Show stats overlay
document.getElementById('statsButton').addEventListener('click', () => {
    statsOverlay.style.display = 'flex';
    updateDisplay();
});

// Close stats overlay
closeStats.addEventListener('click', () => {
    statsOverlay.style.display = 'none';
});

// Show reset confirmation overlay
resetProgressButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'flex';
});

// Close reset confirmation overlay
closeResetConfirmation.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});

// Confirm reset progress
confirmResetButton.addEventListener('click', () => {
    // Reset variables to initial values
    cash = 0;
    cashPerClick = 0.50; // Reset to initial cash per click
    cashPerSecond = 0.25; // Reset to initial cash per second
    upgradeClickCost = 10.00; // Reset initial cost of click upgrade
    upgradeAutomaticCost = 10.00; // Reset initial cost of automatic upgrade
    highestCash = 0;
    netCash = 0;

    // Clear saved data from localStorage
    localStorage.removeItem('gameState');

    // Update button text to reflect reset costs
    upgradeClickButton.textContent = `Buy More Cash Per Click (Cost: $${upgradeClickCost.toFixed(2)})`;
    upgradeAutomaticButton.textContent = `Buy More Cash Per Second (Cost: $${upgradeAutomaticCost.toFixed(2)})`;

    // Update displayed values to reset state
    updateDisplay();

    // Hide reset confirmation overlay
    resetConfirmationOverlay.style.display = 'none';
});

// Cancel reset progress
cancelResetButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});
