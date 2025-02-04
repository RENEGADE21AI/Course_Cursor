function scaleGame() {
    const gameContainer = document.getElementById("game-container");

    // Base resolution (matches your design)
    const baseWidth = 2560;
    const baseHeight = 1440;

    // Calculate scaling factor
    let scale = Math.min(window.innerWidth / baseWidth, window.innerHeight / baseHeight);
    scale = Math.max(scale, 0.6); // Prevents shrinking too much

    // Apply scaling
    gameContainer.style.transform = `scale(${scale})`;

    // Fix centering issue
    gameContainer.style.position = "absolute";
    gameContainer.style.left = "50%";
    gameContainer.style.top = "50%";
    gameContainer.style.transformOrigin = "top left";
    gameContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

// Call scale function on load and resize
window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
