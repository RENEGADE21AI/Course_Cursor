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

    // Apply scaling and centering
    gameContainer.style.transform = `scale(${scaleFactor})`;
    gameContainer.style.left = `${(screenWidth - targetWidth * scaleFactor) / 2}px`;
    gameContainer.style.top = `${(screenHeight - targetHeight * scaleFactor) / 2}px`;
}

// Adjust when screen resizes
window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
