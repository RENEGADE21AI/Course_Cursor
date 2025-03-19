// numberFormatter.js - Converts large numbers into a compact format

function formatNumber(num) {
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No"];
    let tier = Math.floor(Math.log10(num) / 3); 
    
    if (tier === 0) return num.toFixed(2); // Show full value if < 1,000
    
    let scaled = num / Math.pow(10, tier * 3);
    return scaled.toFixed(2) + suffixes[tier];
}

// Attach to window for global access
window.formatNumber = formatNumber;
