const tabFiles = {
    playTab: "tabs/playTab.html",
    accountTab: "tabs/accountTab.html",
    cashWorldTab: "tabs/cashWorldTab.html",
    clansTab: "tabs/clansTab.html",
    miniGamesTab: "tabs/miniGamesTab.html",
    soundTracksTab: "tabs/soundTracksTab.html",
    statsTab: "tabs/statsTab.html",
    settingsTab: "tabs/settingsTab.html"
};

async function loadTabs() {
    for (const [tabId, filePath] of Object.entries(tabFiles)) {
        const response = await fetch(filePath);
        const html = await response.text();
        document.getElementById(tabId).innerHTML = html;
    }
}

// Load all tab content after page load
window.addEventListener("load", loadTabs);
