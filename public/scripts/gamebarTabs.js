// Tab switching logic
const tabs = {
  playButton: document.getElementById('playTab'),
  accountButton: document.getElementById('accountTab'),
  // Add other buttons and their corresponding tabs here
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
// Add event listeners for other buttons as needed
