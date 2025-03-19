// Map buttons to corresponding tabs
const tabButtons = {
    playButton: "playTab",
    accountButton: "accountTab",
    cashWorldButton: "cashWorldTab",
    clansButton: "clansTab",
    minigamesButton: "miniGamesTab",
    soundtracksButton: "soundTracksTab",
    statsButton: "statsTab",
    settingsButton: "settingsTab"
};

// Function to switch tabs
function switchTab(activeTabId) {
    // Hide all tabs
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    // Show the selected tab
    const activeTab = document.getElementById(activeTabId);
    if (activeTab) {
        activeTab.classList.add("active");
    }
}

// Attach event listeners to each navigation button
Object.keys(tabButtons).forEach(buttonId => {
    const button = document.getElementById(buttonId);
    if (button) {
        button.addEventListener("click", () => switchTab(tabButtons[buttonId]));
    }
});
