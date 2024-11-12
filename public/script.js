// script.js
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
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

// Update display based on current game state
function updateDisplay() {
  scoreDisplay.textContent = `Cash: $${cash.toFixed(2)}`;
}

// Save game state to localStorage periodically
function saveGameState() {
  localStorage.setItem('gameState', JSON.stringify({
    cash, cashPerClick, cashPerSecond, upgradeClickCost, upgradeAutomaticCost, highestCash, netCash, totalHoursPlayed
  }));
}

// Load saved state from localStorage on window load
window.onload = () => {
  const savedState = localStorage.getItem('gameState');
  if (savedState) {
    const state = JSON.parse(savedState);
    Object.assign({ cash, cashPerClick, cashPerSecond, upgradeClickCost, upgradeAutomaticCost, highestCash, netCash, totalHoursPlayed }, state);
    updateDisplay();
  }
};

// Authentication function
async function authenticateUser(endpoint, email, password) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);
    alert(`${endpoint.charAt(0).toUpperCase() + endpoint.slice(1)} successful!`);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Login and Register event listeners
loginButton.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  authenticateUser('login', email, password);
});

registerButton.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  authenticateUser('register', email, password);
});

// Button functionality for earning cash and upgrading
clickCash.addEventListener('click', () => {
  cash += cashPerClick;
  updateDisplay();
  clickCash.style.transform = 'scale(1.1)';
  setTimeout(() => { clickCash.style.transform = 'scale(1)' }, 100);
});

upgradeClickButton.addEventListener('click', () => {
  if (cash >= upgradeClickCost) {
    cash -= upgradeClickCost;
    cashPerClick = Math.ceil(cashPerClick * 1.15 * 100) / 100;
    upgradeClickCost = Math.ceil(upgradeClickCost * 1.15 * 100) / 100;
    updateDisplay();
  }
});

upgradeAutomaticButton.addEventListener('click', () => {
  if (cash >= upgradeAutomaticCost) {
    cash -= upgradeAutomaticCost;
    cashPerSecond = Math.ceil(cashPerSecond * 1.15 * 100) / 100;
    upgradeAutomaticCost = Math.ceil(upgradeAutomaticCost * 1.15 * 100) / 100;
    updateDisplay();
  }
});

// Periodically add cash per second
setInterval(() => {
  cash += cashPerSecond;
  updateDisplay();
}, 1000);

// Save game state every 1 second
setInterval(saveGameState, 1000);
