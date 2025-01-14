// Function to update displayed stats
function updateDisplay() {
    const cashElement = scoreDisplay;

    // Apply animation based on cash changes
    if (cash > previousCash) {
        cashElement.style.animation = "cashIncrease 0.3s ease-in-out"; // Green and grows for increase
    } else if (cash < previousCash) {
        cashElement.style.animation = "cashDecrease 0.3s ease-in-out"; // Red and shrinks for decrease
    }

    // Reset animation after it's complete
    setTimeout(() => {
        cashElement.style.animation = "";
    }, 300);

    // Update the displayed cash value
    cashElement.textContent = `$${cash.toFixed(2)}`;

    // Update other values
    clickInfo.textContent = `Value: $${cashPerClick.toFixed(2)}`;
    automaticInfo.textContent = `Value: $${cashPerSecond.toFixed(2)}`;
    clickCostDisplay.textContent = `Cost: $${upgradeClickCost.toFixed(2)}`;
    automaticCostDisplay.textContent = `Cost: $${upgradeAutomaticCost.toFixed(2)}`;
    highestCashDisplay.textContent = highestCash.toFixed(2);
    netCashDisplay.textContent = netCash.toFixed(2);
    hoursPlayedDisplay.textContent = (totalHoursPlayed / 3600).toFixed(2);

    // Update the previous cash value
    previousCash = cash;
}
