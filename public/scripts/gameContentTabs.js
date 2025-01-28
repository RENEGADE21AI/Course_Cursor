// Tab mapping
const tabs = {
  playButton: document.getElementById('playTab'),
  accountButton: document.getElementById('accountTab'),
  cashWorldButton: document.getElementById('cashWorldTab'),
  clansButton: document.getElementById('clansTab'),
  minigamesButton: document.getElementById('miniGamesTab'),
  soundtracksButton: document.getElementById('soundTracksTab'),
  statsButton: document.getElementById('statsTab'),
  settingsButton: document.getElementById('settingsTab'),
};

// Function to switch tabs
function switchTab(activeButtonId) {
  // Hide all tabs
  Object.values(tabs).forEach(tab => {
    tab.classList.remove('active');
  });

  // Show the selected tab
  if (tabs[activeButtonId]) {
    tabs[activeButtonId].classList.add('active');
  }
}

// Dynamically add event listeners to all buttons
Object.keys(tabs).forEach(buttonId => {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', () => switchTab(buttonId));
  }
});
