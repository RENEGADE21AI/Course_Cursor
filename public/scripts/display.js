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

    // Display formatted values for readability
    cashElement.textContent = `$${formatNumber(cash)}`;
    clickInfo.textContent = `Value: $${formatNumber(cashPerClick)}`;
    automaticInfo.textContent = `Value: $${formatNumber(cashPerSecond)}`;
    clickCostDisplay.textContent = `Cost: $${formatNumber(upgradeClickCost)}`;
    automaticCostDisplay.textContent = `Cost: $${formatNumber(upgradeAutomaticCost)}`;
    highestCashDisplay.textContent = formatNumber(highestCash);
    netCashDisplay.textContent = formatNumber(netCash);
    hoursPlayedDisplay.textContent = `${formatNumber(totalHoursPlayed / 3600)} hours`;

    // Update previous cash AFTER animations are triggered
    previousCash = cash;
}
