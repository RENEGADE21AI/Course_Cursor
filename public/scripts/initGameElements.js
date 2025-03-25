function initializeGameElements() {
    // Select dynamic DOM elements after tab content loads
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

    // Attach click and upgrade event listeners
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

    // Start passive income loop (only once)
    if (!window.passiveIncomeInterval) {
        window.passiveIncomeInterval = setInterval(() => {
            cash += cashPerSecond;
            netCash += cashPerSecond;
            highestCash = Math.max(highestCash, cash);
            totalHoursPlayed += 1 / 3600;
            updateDisplay();
        }, 1000);
    }

    // ✅ Create and initialize the Cash World grid after tab loads
    createCashWorldGrid();
}

function createCashWorldGrid() {
    const gridElement = document.getElementById("cash-world-grid");
    if (!gridElement) return;

    gridElement.innerHTML = ""; // Clear if reloaded
    for (let i = 0; i < 50 * 50; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        gridElement.appendChild(tile);
    }

    let offsetX = 0, offsetY = 0;
    let zoomLevel = 1;

    // WASD scrolling
    window.addEventListener("keydown", (e) => {
        switch (e.key.toLowerCase()) {
            case 'w': offsetY += 20; break;
            case 's': offsetY -= 20; break;
            case 'a': offsetX += 20; break;
            case 'd': offsetX -= 20; break;
        }
        updateGridTransform();
    });

    // Zooming with mouse wheel
    document.getElementById("cash-world-grid-container")?.addEventListener("wheel", (e) => {
        e.preventDefault();
        zoomLevel += e.deltaY * -0.001;
        zoomLevel = Math.min(Math.max(zoomLevel, 0.3), 3);
        updateGridTransform();
    });

    function updateGridTransform() {
        gridElement.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
    }
}
