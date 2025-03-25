function initializeGameElements() {
    // Select DOM elements after tab content is loaded
    clickCash = document.getElementById('clickCash');
    scoreDisplay = document.getElementById('scoreDisplay');
    upgradeClickButton = document.getElementById('upgradeClickButton');
    upgradeAutomaticButton = document.getElementById('upgradeAutomaticButton');
    clickInfo = document.getElementById('clickInfo');
    automaticInfo = document.getElementById('automaticInfo');
    clickCostDisplay = document.getElementById('clickCost');
    automaticCostDisplay = document.getElementById('automaticCost');
    highestCashDisplay = document.getElementById('highestCash');
    netCashDisplay = document.getElementById('netCash');
    hoursPlayedDisplay = document.getElementById('hoursPlayed');

    // Attach event listeners
    clickCash?.addEventListener('click', () => {
        cash += cashPerClick;
        netCash += cashPerClick;
        highestCash = Math.max(highestCash, cash);
        updateDisplay();
    });

    upgradeClickButton?.addEventListener('click', () => {
        if (cash >= upgradeClickCost) {
            cash -= upgradeClickCost;
            cashPerClick = Math.ceil(cashPerClick * 1.15 * 100) / 100;
            upgradeClickCost = Math.ceil(upgradeClickCost * 1.15 * 100) / 100;
            updateDisplay();
        }
    });

    upgradeAutomaticButton?.addEventListener('click', () => {
        if (cash >= upgradeAutomaticCost) {
            cash -= upgradeAutomaticCost;
            cashPerSecond = Math.ceil(cashPerSecond * 1.15 * 100) / 100;
            upgradeAutomaticCost = Math.ceil(upgradeAutomaticCost * 1.15 * 100) / 100;
            updateDisplay();
        }
    });

    // Start passive income loop (if not already started)
    if (!window.passiveIncomeInterval) {
        window.passiveIncomeInterval = setInterval(() => {
            cash += cashPerSecond;
            netCash += cashPerSecond;
            highestCash = Math.max(highestCash, cash);
            totalHoursPlayed += 1 / 3600;
            updateDisplay();
        }, 1000);
    }
}
