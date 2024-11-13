import supabase from './supabase.js';

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

async function handleLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.user) {
        loadGameData(data.user);
        loginRegisterOverlay.style.display = 'none';
    }
}

async function handleRegister() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (data?.user) {
        saveGameData();
        loginRegisterOverlay.style.display = 'none';
    }
}

loginButton.addEventListener('click', handleLogin);
registerButton.addEventListener('click', handleRegister);

async function saveGameData() {
    const user = supabase.auth.user();
    if (user) {
        const { data, error } = await supabase.from('game_data').upsert([
            {
                user_id: user.id,
                cash,
                cash_per_click: cashPerClick,
                cash_per_second: cashPerSecond,
                highest_cash: highestCash,
                net_cash: netCash,
                total_hours_played: totalHoursPlayed
            }
        ]);
    }
}

async function loadGameData(user) {
    const { data: gameData, error } = await supabase
        .from("game_data")
        .select("*")
        .eq("user_id", user.id)
        .single();
    if (gameData) {
        cash = gameData.cash;
        cashPerClick = gameData.cash_per_click;
        cashPerSecond = gameData.cash_per_second;
        highestCash = gameData.highest_cash;
        netCash = gameData.net_cash;
        totalHoursPlayed = gameData.total_hours_played;
        updateDisplay();
    }
}

setInterval(saveGameData, 60000);
