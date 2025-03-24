function initializeGameElements() {
    // Re-grab DOM elements after tabs are loaded
    window.clickCash = document.getElementById('clickCash');
    window.upgradeClickButton = document.getElementById('upgradeClickButton');
    window.upgradeAutomaticButton = document.getElementById('upgradeAutomaticButton');
    window.clickInfo = document.getElementById('clickInfo');
    window.automaticInfo = document.getElementById('automaticInfo');
    window.clickCostDisplay = document.getElementById('clickCost');
    window.automaticCostDisplay = document.getElementById('automaticCost');

    // Attach event listeners
    if (clickCash) {
        clickCash.addEventListener('click', () => {
            cash += cashPerClick;
            netCash += cashPerClick;
            highestCash = Math.max(highestCash, cash);
            updateDisplay();
        });
    }

    if (upgradeClickButton) {
        upgradeClickButton.addEventListener('click', () => {
            if (cash >= upgradeClickCost) {
                cash -= upgradeClickCost;
                cashPerClick = Math.ceil(cashPerClick * 1.15 * 100) / 100;
                upgradeClickCost = Math.ceil(upgradeClickCost * 1.15 * 100) / 100;
                updateDisplay();
            }
        });
    }

    if (upgradeAutomaticButton) {
        upgradeAutomaticButton.addEventListener('click', () => {
            if (cash >= upgradeAutomaticCost) {
                cash -= upgradeAutomaticCost;
                cashPerSecond = Math.ceil(cashPerSecond * 1.15 * 100) / 100;
                upgradeAutomaticCost = Math.ceil(upgradeAutomaticCost * 1.15 * 100) / 100;
                updateDisplay();
            }
        });
    }
}
