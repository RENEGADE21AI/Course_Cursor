function scaleGame() {
    const gameContainer = document.getElementById("game-container");

    // Target resolution
    const targetWidth = 1600;
    const targetHeight = 900;

    // Get available screen space
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate scale factor while maintaining aspect ratio
    let scaleFactor = Math.min(screenWidth / targetWidth, screenHeight / targetHeight);

    // Apply scaling while ensuring it stays centered
    gameContainer.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
    gameContainer.style.position = "absolute";
    gameContainer.style.left = "50%";
    gameContainer.style.top = "50%";
}

// Run on load and when resizing
window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
