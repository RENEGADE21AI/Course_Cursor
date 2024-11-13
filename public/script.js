// Game state variables
let cash = 0;
let cashPerClick = 0.50;
let cashPerSecond = 0.25;
let upgradeClickCost = 10.00;
let upgradeAutomaticCost = 10.00;
let highestCash = 0;
let netCash = 0;
let totalHoursPlayed = 0;

// HTML elements
const clickCash = document.getElementById('clickCash');
const scoreDisplay = document.getElementById('scoreDisplay');
const upgradeClickButton = document.getElementById('upgradeClickButton');
const upgradeAutomaticButton = document.getElementById('upgradeAutomaticButton');
const clickInfo = document.getElementById('clickInfo');
const automaticInfo = document.getElementById('automaticInfo');
const settingsOverlay = document.getElementById('settingsOverlay');
const statsOverlay = document.getElementById('statsOverlay');
const settingsButton = document.getElementById('settingsButton');
const statsButton = document.getElementById('statsButton');
const closeSettings = document.getElementById('closeSettings');
const closeStats = document.getElementById('closeStats');
const resetProgressButton = document.getElementById('resetProgressButton');
const resetConfirmationOverlay = document.getElementById('resetConfirmationOverlay');
const closeResetConfirmation = document.getElementById('closeResetConfirmation');
const confirmResetButton = document.getElementById('confirmResetButton');
const cancelResetButton = document.getElementById('cancelResetButton');
const highestCashDisplay = document.getElementById('highestCash');
const netCashDisplay = document.getElementById('netCash');
const hoursPlayedDisplay = document.getElementById('hoursPlayed');

// Login/Register modal elements
const loginRegisterOverlay = document.getElementById('loginRegisterOverlay');
const closeLoginRegister = document.getElementById('closeLoginRegister');
const loginRegisterButton = document.getElementById('loginRegisterButton'); // From Settings
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

// Function to update display elements based on game state
function updateDisplay() {
    scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
    clickInfo.textContent = `Current Cash Per Click: $${cashPerClick.toFixed(2)}`;
    automaticInfo.textContent = `Current Cash Per Second: $${cashPerSecond.toFixed(2)}`;
    upgradeClickButton.textContent = `Buy More Cash Per Click (Cost: $${upgradeClickCost.toFixed(2)})`;
    upgradeAutomaticButton.textContent = `Buy More Cash Per Second (Cost: $${upgradeAutomaticCost.toFixed(2)})`;
    highestCashDisplay.textContent = highestCash.toFixed(2);
    netCashDisplay.textContent = netCash.toFixed(2);
    hoursPlayedDisplay.textContent = totalHoursPlayed.toFixed(2);
}

// Click event to add cash based on cashPerClick
clickCash.addEventListener('click', () => {
    const previousCash = cash;
    cash += cashPerClick;
    if (cash > highestCash) highestCash = cash;
    if (cash > previousCash) netCash += (cash - previousCash); // Increase netCash by the amount cash increased
    updateDisplay();
});

// Function to upgrade cash per click
upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
        cash -= upgradeClickCost;
        cashPerClick += 0.25;
        upgradeClickCost *= 1.15; // Increase cost by 15% instead of 50%
        updateDisplay();
    }
});

// Function to upgrade cash per second
upgradeAutomaticButton.addEventListener('click', () => {
    if (cash >= upgradeAutomaticCost) {
        cash -= upgradeAutomaticCost;
        cashPerSecond += 0.10;
        upgradeAutomaticCost *= 1.15; // Increase cost by 15% instead of 50%
        updateDisplay();
    }
});

// Automatic cash generation based on cashPerSecond
setInterval(() => {
    const previousCash = cash;
    cash += cashPerSecond;
    if (cash > highestCash) highestCash = cash;
    if (cash > previousCash) netCash += (cash - previousCash); // Increase netCash by the amount cash increased
    updateDisplay();
}, 1000);

// Show settings overlay when the Settings button is clicked
settingsButton.addEventListener('click', () => {
    settingsOverlay.style.display = 'flex'; // Show the overlay as flex to center content
});

// Show stats overlay when the Stats button is clicked
statsButton.addEventListener('click', () => {
    statsOverlay.style.display = 'flex'; // Show the overlay as flex to center content
});

// Event listener for Login/Register button in Settings overlay
loginRegisterButton.addEventListener('click', () => {
    settingsOverlay.style.display = 'none';          // Close the Settings overlay
    loginRegisterOverlay.style.display = 'flex';     // Show the Login/Register overlay
});

// Event listeners for overlays
closeSettings.addEventListener('click', () => settingsOverlay.style.display = 'none');
closeStats.addEventListener('click', () => statsOverlay.style.display = 'none');
resetProgressButton.addEventListener('click', () => resetConfirmationOverlay.style.display = 'block');
closeResetConfirmation.addEventListener('click', () => resetConfirmationOverlay.style.display = 'none');
cancelResetButton.addEventListener('click', () => resetConfirmationOverlay.style.display = 'none');

// Reset game progress
confirmResetButton.addEventListener('click', () => {
    cash = 0;
    cashPerClick = 0.50;
    cashPerSecond = 0.25;
    upgradeClickCost = 10.00;
    upgradeAutomaticCost = 10.00;
    highestCash = 0;
    netCash = 0;
    totalHoursPlayed = 0;
    updateDisplay();
    resetConfirmationOverlay.style.display = 'none';
});

// Login/Register event listeners
closeLoginRegister.addEventListener('click', () => loginRegisterOverlay.style.display = 'none');
loginButton.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        alert('Login failed');
    } else {
        alert('Login successful');
        loginRegisterOverlay.style.display = 'none';
    }
});
registerButton.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
        alert('Registration failed');
    } else {
        alert('Registration successful');
        loginRegisterOverlay.style.display = 'none';
    }
});

// Initial display update
updateDisplay();
