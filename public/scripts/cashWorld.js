class CashWorld {
    constructor() {
        this.gridElement = document.getElementById("cash-world-grid");
        this.gridSizeX = 240;  // Number of tiles horizontally
        this.gridSizeY = 117;  // Number of tiles vertically
        this.tileSize = 10;     // Each tile is 10px
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoomLevel = 1;

        this.biomeMap = this.generateBiomeMap();  // Store biome data
        this.initGrid();
        this.setupControls();
    }

    generateBiomeMap() {
        let map = [];
        for (let y = 0; y < this.gridSizeY; y++) {
            let row = [];
            for (let x = 0; x < this.gridSizeX; x++) {
                row.push(this.assignBiome(x, y));  // Assign a biome to each tile
            }
            map.push(row);
        }
        return map;
    }

    assignBiome(x, y) {
        const biomes = ["plains", "forest", "desert", "tundra", "swamp"];
        const noiseValue = Math.random();  // Randomized for now; can use Perlin Noise later
        
        if (noiseValue < 0.2) return "desert";
        if (noiseValue < 0.4) return "forest";
        if (noiseValue < 0.6) return "swamp";
        if (noiseValue < 0.8) return "tundra";
        return "plains";
    }

    getBiomeColor(biome) {
        const biomeColors = {
            "plains": "#7ec850",   // Green
            "forest": "#2d6a4f",   // Dark Green
            "desert": "#e4c16f",   // Sand Yellow
            "tundra": "#b8d0e6",   // Cold Blue
            "swamp": "#4b6d3c"     // Muddy Green
        };
        return biomeColors[biome] || "#7ec850";  // Default to plains
    }

    initGrid() {
        this.gridElement.innerHTML = "";
        for (let y = 0; y < this.gridSizeY; y++) {
            for (let x = 0; x < this.gridSizeX; x++) {
                const tile = document.createElement("div");
                tile.classList.add("tile");
                tile.style.backgroundColor = this.getBiomeColor(this.biomeMap[y][x]);
                this.gridElement.appendChild(tile);
            }
        }
    }

    setupControls() {
        window.addEventListener("keydown", (e) => this.handleMovement(e));
        document.getElementById("cash-world-grid-container").addEventListener("wheel", (e) => this.handleZoom(e));
    }

    handleMovement(e) {
        switch (e.key.toLowerCase()) {
            case 'w': this.offsetY += this.tileSize; break;
            case 's': this.offsetY -= this.tileSize; break;
            case 'a': this.offsetX += this.tileSize; break;
            case 'd': this.offsetX -= this.tileSize; break;
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
