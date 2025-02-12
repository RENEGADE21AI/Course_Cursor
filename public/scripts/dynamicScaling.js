function scaleGame() {
    const screenContainer = document.getElementById("screen-container");

    // Target resolution (entire game, including nav bar)
    const targetWidth = 2400;
    const targetHeight = 1350;

    // Get available screen space
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Calculate scale factor while maintaining aspect ratio
    let scaleFactor = Math.min(screenWidth / targetWidth, screenHeight / targetHeight);

    // Apply scaling while ensuring it stays centered
    screenContainer.style.transform = `translate(-50%, -50%) scale(${scaleFactor})`;
    screenContainer.style.position = "absolute";
    screenContainer.style.left = "50%";
    screenContainer.style.top = "50%";

    // Update CSS variable for proportional scaling of all elements inside screen-container
    document.documentElement.style.setProperty('--scale-factor', scaleFactor);
}

// Run on load and when resizing
window.addEventListener("resize", scaleGame);
window.addEventListener("load", scaleGame);
