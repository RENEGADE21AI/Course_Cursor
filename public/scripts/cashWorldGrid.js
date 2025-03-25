const gridElement = document.getElementById("cash-world-grid");
let offsetX = 0, offsetY = 0;
let zoomLevel = 1;

// Generate grid tiles
for (let i = 0; i < 50 * 50; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    gridElement.appendChild(tile);
}

// Scrolling logic (WASD)
window.addEventListener("keydown", (e) => {
    switch (e.key.toLowerCase()) {
        case 'w': offsetY += 50; break;
        case 's': offsetY -= 50; break;
        case 'a': offsetX += 50; break;
        case 'd': offsetX -= 50; break;
    }
    updateGridTransform();
});

// Zoom logic (mouse wheel)
document.getElementById("cash-world-grid-container")?.addEventListener("wheel", (e) => {
    e.preventDefault();
    zoomLevel += e.deltaY * -0.001;
    zoomLevel = Math.min(Math.max(zoomLevel, 0.5), 2.5);
    updateGridTransform();
});

// Update transform on grid
function updateGridTransform() {
    gridElement.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${zoomLevel})`;
}
