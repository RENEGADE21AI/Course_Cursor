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

// Increment cash every second
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
