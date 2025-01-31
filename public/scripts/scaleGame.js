function scaleGame() {
    const gameContainer = document.getElementById("game-container");

    // Base resolution (same as your design)
    const baseWidth = 1920;
    const baseHeight = 1080;

    // Calculate the scale factor based on the screen size
    const scale = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);

    // Apply the scale
    gameContainer.style.transform = `scale(${scale})`;

    // Center the game
    gameContainer.style.left = `${(window.innerWidth - baseWidth * scale) / 2}px`;
    gameContainer.style.top = `${(window.innerHeight - baseHeight * scale) / 2}px`;
}

// Call scale function on load and resize
window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
