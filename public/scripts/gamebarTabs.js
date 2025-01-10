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
function switchTab(activeTab) {
  // Hide all tabs
  Object.values(tabs).forEach(tab => tab?.classList.remove('active'));

  // Show the selected tab
  if (tabs[activeTab]) {
    tabs[activeTab].classList.add('active');
  }
}

// Dynamically add event listeners for all buttons
Object.keys(tabs).forEach(buttonId => {
  const button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', () => switchTab(buttonId));
  }
});
