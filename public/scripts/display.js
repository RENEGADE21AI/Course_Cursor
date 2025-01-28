// Function to update displayed stats
function updateDisplay() {
    const cashElement = scoreDisplay;

    // Determine if cash has increased or decreased
    if (cash > previousCash) {
        cashElement.classList.add("increase");
    } else if (cash < previousCash) {
        cashElement.classList.add("decrease");
    }

    // Reset the animation by removing and re-adding the class
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

    // Update previous cash value AFTER the animation logic
    previousCash = cash;
}
