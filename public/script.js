console.log("script.js loaded!");

// Variables to manage game state
let cash = 0;
let cashPerClick = 0.50;
let cashPerSecond = 0.25;
let upgradeClickCost = 10.00;
let upgradeAutomaticCost = 10.00;
let highestCash = 0;
let netCash = 0;
let totalHoursPlayed = 0;

// DOM element references
const clickCash = document.getElementById("clickCash");
const scoreDisplay = document.getElementById("scoreDisplay");
const upgradeClickButton = document.getElementById("upgradeClickButton");
const upgradeAutomaticButton = document.getElementById("upgradeAutomaticButton");
const clickInfo = document.getElementById("clickInfo");
const automaticInfo = document.getElementById("automaticInfo");
const statsOverlay = document.getElementById("statsOverlay");
const settingsOverlay = document.getElementById("settingsOverlay");
const accountOverlay = document.getElementById("accountOverlay");
const resetConfirmationOverlay = document.getElementById("resetConfirmationOverlay");
const highestCashDisplay = document.getElementById("highestCash");
const netCashDisplay = document.getElementById("netCash");
const hoursPlayedDisplay = document.getElementById("hoursPlayed");
const statsButton = document.getElementById("statsButton");
const settingsButton = document.getElementById("settingsButton");
const accountSettingsButton = document.getElementById("accountSettingsButton");
const loginRegisterButton = document.getElementById("loginRegisterButton");
const resetProgressButton = document.getElementById("resetProgressButton");
const closeStats = document.getElementById("closeStats");
const closeSettings = document.getElementById("closeSettings");
const closeAccount = document.getElementById("closeAccount");
const closeResetConfirmation = document.getElementById("closeResetConfirmation");
const confirmResetButton = document.getElementById("confirmResetButton");
const cancelResetButton = document.getElementById("cancelResetButton");

// Function to update displayed stats
function updateDisplay() {
  scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
  clickInfo.textContent = `Current Cash Per Click: $${cashPerClick.toFixed(2)}`;
  automaticInfo.textContent = `Current Cash Per Second: $${cashPerSecond.toFixed(2)}`;
  upgradeClickButton.textContent = `Buy More Cash Per Click (Cost: $${upgradeClickCost.toFixed(2)})`;
  upgradeAutomaticButton.textContent = `Buy More Cash Per Second (Cost: $${upgradeAutomaticCost.toFixed(2)})`;
  highestCashDisplay.textContent = highestCash.toFixed(2);
  netCashDisplay.textContent = netCash.toFixed(2);
  hoursPlayedDisplay.textContent = (totalHoursPlayed / 3600).toFixed(2);
}

// Event listeners for upgrades
upgradeClickButton.addEventListener("click", () => {
  if (cash >= upgradeClickCost) {
    cash -= upgradeClickCost;
    cashPerClick = Math.ceil(cashPerClick * 1.15 * 100) / 100;
    upgradeClickCost = Math.ceil(upgradeClickCost * 1.25 * 100) / 100;
    updateDisplay();
    saveLocalGameData();
  }
});

upgradeAutomaticButton.addEventListener("click", () => {
  if (cash >= upgradeAutomaticCost) {
    cash -= upgradeAutomaticCost;
    cashPerSecond = Math.ceil(cashPerSecond * 1.15 * 100) / 100;
    upgradeAutomaticCost = Math.ceil(upgradeAutomaticCost * 1.25 * 100) / 100;
    updateDisplay();
    saveLocalGameData();
  }
});

// Increment cash on click
clickCash.addEventListener("click", () => {
  cash += cashPerClick;
  netCash += cashPerClick;
  highestCash = Math.max(highestCash, cash);
  updateDisplay();
  saveLocalGameData();
  // Animation effect
  clickCash.style.transform = "scale(1.1)";
  setTimeout(() => (clickCash.style.transform = "scale(1)"), 100);
});

// Automatically increment cash per second
setInterval(() => {
  cash += cashPerSecond;
  netCash += cashPerSecond;
  highestCash = Math.max(highestCash, cash);
  totalHoursPlayed += 1 / 3600;
  updateDisplay();
  saveLocalGameData();
}, 1000);

// Pop-up logic
statsButton.addEventListener("click", () => (statsOverlay.style.display = "flex"));
closeStats.addEventListener("click", () => (statsOverlay.style.display = "none"));

settingsButton.addEventListener("click", () => (settingsOverlay.style.display = "flex"));
closeSettings.addEventListener("click", () => (settingsOverlay.style.display = "none"));

accountSettingsButton.addEventListener("click", () => (accountOverlay.style.display = "flex"));
loginRegisterButton.addEventListener("click", () => (accountOverlay.style.display = "flex"));
closeAccount.addEventListener("click", () => (accountOverlay.style.display = "none"));

resetProgressButton.addEventListener("click", () => (resetConfirmationOverlay.style.display = "flex"));
closeResetConfirmation.addEventListener("click", () => (resetConfirmationOverlay.style.display = "none"));
cancelResetButton.addEventListener("click", () => (resetConfirmationOverlay.style.display = "none"));

// Reset game logic
confirmResetButton.addEventListener("click", () => {
  resetGame();
  resetConfirmationOverlay.style.display = "none";
});

// Save to local storage
function saveLocalGameData() {
  localStorage.setItem("gameData", JSON.stringify({ cash, cashPerClick, cashPerSecond, upgradeClickCost, upgradeAutomaticCost, highestCash, netCash, totalHoursPlayed }));
}

// Load game data from local storage
function loadLocalGameData() {
  const savedData = JSON.parse(localStorage.getItem("gameData"));
  if (savedData) {
    cash = savedData.cash || 0;
    cashPerClick = savedData.cashPerClick || 0.5;
    cashPerSecond = savedData.cashPerSecond || 0.25;
    upgradeClickCost = savedData.upgradeClickCost || 10.0;
    upgradeAutomaticCost = savedData.upgradeAutomaticCost || 10.0;
    highestCash = savedData.highestCash || 0;
    netCash = savedData.netCash || 0;
    totalHoursPlayed = savedData.totalHoursPlayed || 0;
  }
  updateDisplay();
}

// Reset game
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

// Initialize game
loadLocalGameData();
console.log("script.js ran all the way through to the end!");
