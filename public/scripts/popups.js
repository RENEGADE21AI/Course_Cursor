// Pop-up handling
statsButton.addEventListener('click', () => {
    statsOverlay.style.display = 'flex';
});
closeStats.addEventListener('click', () => {
    statsOverlay.style.display = 'none';
});

settingsButton.addEventListener('click', () => {
    settingsOverlay.style.display = 'flex';
});
closeSettings.addEventListener('click', () => {
    settingsOverlay.style.display = 'none';
});

accountButton.addEventListener('click', () => {
    accountOverlay.style.display = 'flex';
});
closeAccount.addEventListener('click', () => {
    accountOverlay.style.display = 'none';
});

soundtracksButton.addEventListener('click', () => {
    soundtracksOverlay.style.display = 'flex';
});
closeSoundtracks.addEventListener('click', () => {
    soundtracksOverlay.style.display = 'none';
});

resetProgressButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'flex';
});
closeResetConfirmation.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});

confirmResetButton.addEventListener('click', () => {
    resetGame();
    resetConfirmationOverlay.style.display = 'none';
});

cancelResetButton.addEventListener('click', () => {
    resetConfirmationOverlay.style.display = 'none';
});

// Close clans Pop-up
closeclans.addEventListener('click', () => {
    clansOverlay.style.display = 'none';
});
