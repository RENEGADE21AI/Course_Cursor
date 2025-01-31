function scaleGame() {
    const gameContainer = document.getElementById("game-container");

    // New base resolution (2560x1440)
    const baseWidth = 2560;
    const baseHeight = 1440;

    // Calculate scale factor
    const scale = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);

    // Apply scaling
    gameContainer.style.transform = `scale(${scale})`;

    // Center the game
    gameContainer.style.left = `${(window.innerWidth - baseWidth * scale) / 2}px`;
    gameContainer.style.top = `${(window.innerHeight - baseHeight * scale) / 2}px`;
}

// Call scale function on load and resize
window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
