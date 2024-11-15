console.log("script.js loaded!");

const supabase = window.supabase;

let cash = 0;
let cashPerClick = 0.50;
let cashPerSecond = 0.25;
let upgradeClickCost = 10.00;
let upgradeAutomaticCost = 10.00;
let highestCash = 0;
let netCash = 0;
let totalHoursPlayed = 0;

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

const loginRegisterOverlay = document.getElementById('loginRegisterOverlay');
const closeLoginRegister = document.getElementById('closeLoginRegister');
const loginRegisterButton = document.getElementById('loginRegisterButton');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const usernameInput = document.getElementById('usernameInput');

let currentUser = null; // to track the logged-in user

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

clickCash.addEventListener('click', () => {
    const previousCash = cash;
    cash += cashPerClick;
    if (cash > highestCash) highestCash = cash;
    if (cash > previousCash) netCash += (cash - previousCash);
    updateDisplay();
});

upgradeClickButton.addEventListener('click', () => {
    if (cash >= upgradeClickCost) {
        cash -= upgradeClickCost;
        cashPerClick += 0.25;
        upgradeClickCost *= 1.15;
        updateDisplay();
    }
});

upgradeAutomaticButton.addEventListener('click', () => {
    if (cash >= upgradeAutomaticCost) {
        cash -= upgradeAutomaticCost;
        cashPerSecond += 0.10;
        upgradeAutomaticCost *= 1.15;
        updateDisplay();
    }
});

setInterval(() => {
    const previousCash = cash;
    cash += cashPerSecond;
    if (cash > highestCash) highestCash = cash;
    if (cash > previousCash) netCash += (cash - previousCash);
    updateDisplay();
}, 1000);

settingsButton.addEventListener('click', () => {
    settingsOverlay.style.display = 'flex';
});

statsButton.addEventListener('click', () => {
    statsOverlay.style.display = 'flex';
});

loginRegisterButton.addEventListener('click', () => {
    settingsOverlay.style.display = 'none';
    loginRegisterOverlay.style.display = 'flex';
});

closeSettings.addEventListener('click', () => settingsOverlay.style.display = 'none');
closeStats.addEventListener('click', () => statsOverlay.style.display = 'none');
resetProgressButton.addEventListener('click', () => resetConfirmationOverlay.style.display = 'flex');
closeResetConfirmation.addEventListener('click', () => resetConfirmationOverlay.style.display = 'none');
cancelResetButton.addEventListener('click', () => resetConfirmationOverlay.style.display = 'none');
closeLoginRegister.addEventListener('click', () => loginRegisterOverlay.style.display = 'none');

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

// Login function
async function handleLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const response = await fetch('https://course-cursor.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (result.success) {
        currentUser = result.user;
        loadGameData(result.user);
        loginRegisterOverlay.style.display = 'none';
    } else {
        alert(result.message);
    }
}

// Register function
async function handleRegister() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const response = await fetch('https://course-cursor.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (result.success) {
        currentUser = result.user;
        saveGameData();
        loginRegisterOverlay.style.display = 'none';
    } else {
        alert(result.message);
    }
}

loginButton.addEventListener('click', handleLogin);
registerButton.addEventListener('click', handleRegister);

// Save game data to the server
async function saveGameData() {
    if (currentUser) {
        const response = await fetch('https://course-cursor.onrender.com/api/saveGameData', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUser.id,
                cash,
                cashPerClick,
                cashPerSecond,
                highestCash,
                netCash,
                totalHoursPlayed
            })
        });
        const result = await response.json();
        if (!result.success) {
            alert(result.message);
        }
    }
}

// Load game data from the server
async function loadGameData(user) {
    const response = await fetch(`https://course-cursor.onrender.com/api/loadGameData?user_id=${user.id}`);
    const result = await response.json();
    if (result.success && result.data) {
        cash = result.data.cash;
        cashPerClick = result.data.cash_per_click;
        cashPerSecond = result.data.cash_per_second;
        highestCash = result.data.highest_cash;
        netCash = result.data.net_cash;
        totalHoursPlayed = result.data.total_hours_played;
        updateDisplay();
    } else {
        alert(result.message);
    }
}

// Periodically save game data
setInterval(saveGameData, 60000);

// Save data before user leaves or logs out
window.addEventListener('beforeunload', async (event) => {
    if (currentUser) {
        await saveGameData();
    }
});

// Logout function with manual save
async function handleLogout() {
    if (currentUser) {
        await saveGameData();  // Save data when logging out
    }
    currentUser = null;
    loginRegisterOverlay.style.display = 'flex'; // Show login/register overlay (or redirect as needed)
}

// Example logout button event
const logoutButton = document.getElementById('logoutButton');  // Make sure you have a logout button
logoutButton.addEventListener('click', handleLogout);
