// Club Button Functionality
document.getElementById('clubButton').addEventListener('click', () => {
    document.getElementById('clubOverlay').style.display = 'block';
});

document.getElementById('closeClub').addEventListener('click', () => {
    document.getElementById('clubOverlay').style.display = 'none';
});

document.getElementById('clubCloseButton').addEventListener('click', () => {
    document.getElementById('clubOverlay').style.display = 'none';
});
