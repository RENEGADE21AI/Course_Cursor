function scaleGame() {
    const gameContainer = document.getElementById("game-container");

    // Base resolution
    const baseWidth = 2560;
    const baseHeight = 1440;

    // Calculate scale factor while preventing extreme shrinking
    let scale = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
    scale = Math.max(scale, 0.6); // Ensures game never becomes too small

    // Apply scaling
    gameContainer.style.transform = `scale(${scale})`;

    // Center the game properly
    gameContainer.style.left = `${(window.innerWidth - baseWidth * scale) / 2}px`;
    gameContainer.style.top = `${(window.innerHeight - baseHeight * scale) / 2}px`;
}

// Run on load and resize
window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
