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
