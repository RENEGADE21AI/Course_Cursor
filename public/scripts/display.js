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

    // Update the displayed cash value
    cashElement.textContent = `$${cash.toFixed(2)}`;

    // Update other displayed stats
    clickInfo.textContent = `Value: $${cashPerClick.toFixed(2)}`;
    automaticInfo.textContent = `Value: $${cashPerSecond.toFixed(2)}`;
    clickCostDisplay.textContent = `Cost: $${upgradeClickCost.toFixed(2)}`;
    automaticCostDisplay.textContent = `Cost: $${upgradeAutomaticCost.toFixed(2)}`;
    highestCashDisplay.textContent = highestCash.toFixed(2);
    netCashDisplay.textContent = netCash.toFixed(2);
    hoursPlayedDisplay.textContent = (totalHoursPlayed / 3600).toFixed(2);

    // Update previous cash AFTER animations are triggered
    previousCash = cash;
}
