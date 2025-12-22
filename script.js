// Constants
const SQFEET_PER_ACRE = 43560; // C

document.addEventListener('DOMContentLoaded', () => {
    const calcBtn = document.getElementById('calcBtn');
    const installBtn = document.getElementById('installBtn');

    calcBtn.addEventListener('click', calculate);

    // PWA Install Logic
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBtn.classList.remove('hidden');
    });

    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installBtn.classList.add('hidden');
        }
        deferredPrompt = null;
    });
});

function calculate() {
    // Inputs
    const P = parseFloat(document.getElementById('landSize').value) || 0;
    const D = parseFloat(document.getElementById('rowDist').value) || 0;
    const E = parseFloat(document.getElementById('plantDist').value) || 0;

    // Settings
    const A = parseFloat(document.getElementById('seedsPerGram').value) || 10;
    const B = parseFloat(document.getElementById('gramsPerPouch').value) || 450;
    const F = parseFloat(document.getElementById('seedRatio').value) || 2;

    // Validation
    if (P <= 0 || D <= 0 || E <= 0) {
        alert('Please enter valid positive numbers for Land Size, Line To Line distance, and Plant to Plant distance.');
        return;
    }

    // Calculation Logic
    // 1. L (Plant Area sqft) = D * E
    const L = D * E;

    // 2. K (Total Land sqft) = P * C
    const K = P * SQFEET_PER_ACRE;

    // 3. N (Total Seeds needed) = (K / L) * F
    // Note: K/L gives number of plants theoretically fitting.
    const numberOfPlants = K / L;
    const N = numberOfPlants * F;

    // 4. Q (Seeds per Pouch) = A * B
    const Q = A * B;

    // 5. Total Pouches = N / Q
    const totalPouches = N / Q;

    // Additional Stats
    const totalGrams = N / A;

    // Display Results
    displayResults(totalPouches, N, Q, totalGrams);
}

function displayResults(pouches, totalSeeds, seedsPerPouch, totalGrams) {
    const resultSection = document.getElementById('resultSection');
    const pouchResult = document.getElementById('pouchResult');
    const totalSeedsEl = document.getElementById('totalSeeds');
    const seedsPerPouchEl = document.getElementById('seedsPerPouch');
    const totalGramsEl = document.getElementById('totalGrams');

    // Format numbers
    pouchResult.textContent = pouches.toFixed(2); // Show 2 decimal places for pouches
    totalSeedsEl.textContent = Math.round(totalSeeds).toLocaleString();
    seedsPerPouchEl.textContent = Math.round(seedsPerPouch).toLocaleString();
    totalGramsEl.textContent = totalGrams.toFixed(1) + ' g';

    // Show section
    resultSection.classList.remove('hidden');

    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
