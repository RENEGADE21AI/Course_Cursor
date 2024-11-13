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
const usernameInput = document.getElementById('usernameInput');

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

// Function to handle registration
async function handleRegister() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const username = usernameInput.value;

    try {
        const { user, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        await supabase.from("users").insert([
            {
                id: user.id,
                email: user.email,
                username: username,
                created_at: new Date(),
                last_active: new Date()
            }
        ]);

        // Insert initial game data for new user
        await supabase.from("game_data").insert([
            {
                user_id: user.id,
                cash: 0,
                cash_per_click: 0.50,
                cash_per_second: 0.25,
                highest_cash: 0,
                net_cash: 0,
                total_hours_played: 0
            }
        ]);

        alert("Registration successful! Please log in.");
    } catch (error) {
        alert("Error registering: " + error.message);
    }
}

// Function to handle login
async function handleLogin() {
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const { user, error } = await supabase.auth.signIn({ email, password });
        if (error) throw error;

        alert("Login successful!");
        const { data: gameData, fetchError } = await supabase
            .from("game_data")
            .select("*")
            .eq("user_id", user.id)
            .single();

        if (fetchError) throw fetchError;
        loadGameData(gameData);
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
}

// Utility function to load game data into the game
function loadGameData(gameData) {
    cash = gameData.cash;
    cashPerClick = gameData.cash_per_click;
    cashPerSecond = gameData.cash_per_second;
    highestCash = gameData.highest_cash;
    netCash = gameData.net_cash;
    totalHoursPlayed = gameData.total_hours_played;

    updateDisplay();
}

// Update game data in Supabase
async function updateGameData() {
    const { user } = supabase.auth.session();

    if (user) {
        await supabase
            .from("game_data")
            .upsert([{
                user_id: user.id,
                cash,
                cash_per_click,
                cash_per_second,
                highest_cash,
                net_cash,
                total_hours_played
            }]);
    }
}

// Call `updateGameData` periodically to save the game state
setInterval(updateGameData, 60000); // Save every minute (you can adjust this interval as needed)

// Attach event listeners to login and register buttons
loginButton.addEventListener("click", handleLogin);
registerButton.addEventListener("click", handleRegister);
closeLoginRegister.addEventListener('click', () => loginRegisterOverlay.style.display = 'none');

// Initial display update
updateDisplay();
