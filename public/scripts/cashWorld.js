class CashWorld {
    constructor() {
        this.gridElement = document.getElementById("cash-world-grid");
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoomLevel = 1;

        this.initGrid();
        this.setupControls();
    }

    initGrid() {
        this.gridElement.innerHTML = "";
        for (let i = 0; i < 240 * 117; i++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            this.gridElement.appendChild(tile);
        }
    }

    setupControls() {
        window.addEventListener("keydown", (e) => this.handleMovement(e));
        document.getElementById("cash-world-grid-container").addEventListener("wheel", (e) => this.handleZoom(e));
    }

    handleMovement(e) {
        switch (e.key.toLowerCase()) {
            case 'w': this.offsetY += 10; break;
            case 's': this.offsetY -= 10; break;
            case 'a': this.offsetX += 10; break;
            case 'd': this.offsetX -= 10; break;
        }
        this.updateTransform();
    }

    handleZoom(e) {
        e.preventDefault();
        this.zoomLevel += e.deltaY * -0.001;
        this.zoomLevel = Math.min(Math.max(this.zoomLevel, 0.3), 3);
        this.updateTransform();
    }

    updateTransform() {
        this.gridElement.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) scale(${this.zoomLevel})`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cash-world-grid")) {
        new CashWorld();
    }
});
