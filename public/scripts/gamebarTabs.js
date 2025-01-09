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
  Object.values(tabs).forEach(tab => tab.classList.remove('active'));

  // Show the selected tab
  if (tabs[activeTab]) {
    tabs[activeTab].classList.add('active');
  }
}

// Add event listeners to buttons
document.getElementById('playButton').addEventListener('click', () => switchTab('playButton'));
document.getElementById('accountButton').addEventListener('click', () => switchTab('accountButton'));
document.getElementById('cashWorldButton').addEventListener('click', () => switchTab('cashWorldButton'));
document.getElementById('clansButton').addEventListener('click', () => switchTab('clansButton'));
document.getElementById('minigamesButton').addEventListener('click', () => switchTab('minigamesButton'));
document.getElementById('soundtracksButton').addEventListener('click', () => switchTab('soundtracksButton'));
document.getElementById('statsButton').addEventListener('click', () => switchTab('statsButton'));
document.getElementById('settingsButton').addEventListener('click', () => switchTab('settingsButton'));
