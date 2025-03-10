import { formatNumber } from "./numberFormatter.js"; // Import the function

function updateDisplay() {
    const cashElement = scoreDisplay;

    // Apply animation based on cash changes
    if (cash > previousCash) {
        cashElement.classList.add("increase");
    } else if (cash < previousCash) {
        cashElement.classList.add("decrease");
    }

    // Reset the animation after completion
    setTimeout(() => {
        cashElement.classList.remove("increase", "decrease");
    }, 300);

    // Update the displayed cash value using formatNumber()
    cashElement.textContent = `$${formatNumber(cash)}`;

    // Update other displayed stats (if they need formatting)
    clickInfo.textContent = `Value: $${formatNumber(cashPerClick)}`;
    automaticInfo.textContent = `Value: $${formatNumber(cashPerSecond)}`;
    clickCostDisplay.textContent = `Cost: $${formatNumber(upgradeClickCost)}`;
    automaticCostDisplay.textContent = `Cost: $${formatNumber(upgradeAutomaticCost)}`;
    highestCashDisplay.textContent = formatNumber(highestCash);
    netCashDisplay.textContent = formatNumber(netCash);
    hoursPlayedDisplay.textContent = (totalHoursPlayed / 3600).toFixed(2); // Keep this as a standard decimal format

    // Update previous cash AFTER animations are triggered
    previousCash = cash;
}
