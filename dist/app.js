"use strict";
const canvas = document.getElementById('trig-canvas');
const amplitudeInput = document.getElementById('amplitude');
const frequencyInput = document.getElementById('frequency');
const phaseInput = document.getElementById('phase');
const functionSelect = document.getElementById('function');
const formulaDisplay = document.getElementById('formula');
const firstXDisplay = document.getElementById('first-x');
const firstYDisplay = document.getElementById('first-y');
const ctx = canvas.getContext('2d');
// Lade das edgar-Bild
const edgarImage = new Image();
edgarImage.src = 'edgar.png';
edgarImage.onload = () => {
    // Funktion: Achsen zeichnen
    function drawAxes() {
        const width = canvas.width;
        const height = canvas.height;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        // x-Achse
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        // x-Achse: Beschriftung 1-10
        for (let i = 0; i <= 10; i++) {
            const x = (i / 10) * width;
            ctx.fillText(i.toString(), x - 10, height / 2 + 20);
            ctx.beginPath();
            ctx.moveTo(x, height / 2 - 5);
            ctx.lineTo(x, height / 2 + 5);
            ctx.stroke();
        }
        // y-Achse
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.stroke();
        // y-Achse: Beschriftung 1-10
        for (let i = 0; i <= 10; i++) {
            const y = height / 2 - (i / 10) * (height / 2);
            ctx.fillText(i.toString(), width / 2 + 10, y + 5);
            ctx.beginPath();
            ctx.moveTo(width / 2 - 5, y);
            ctx.lineTo(width / 2 + 5, y);
            ctx.stroke();
            const yNegative = height / 2 + (i / 10) * (height / 2);
            if (i !== 0) {
                ctx.fillText((-i).toString(), width / 2 + 10, yNegative + 5);
                ctx.beginPath();
                ctx.moveTo(width / 2 - 5, yNegative);
                ctx.lineTo(width / 2 + 5, yNegative);
                ctx.stroke();
            }
        }
    }
    // Funktion: Trigonometrische Kurve zeichnen
    function drawTrigFunction(amplitude, frequency, phase, func) {
        const width = canvas.width;
        const height = canvas.height;
        const centerY = height / 2;
        ctx.clearRect(0, 0, width, height); // Canvas leeren
        drawAxes(); // Achsen zeichnen
        const phaseRad = (phase * Math.PI) / 180;
        const edgarHeight = height * 0.3; // edgar-Höhe = 30% der Canvas-Höhe
        let firstY = 0;
        for (let x = 0; x < width; x++) {
            const t = (x / width) * (2 * Math.PI * frequency);
            let y = 0;
            if (func === 'sin') {
                y = amplitude * Math.sin(t + phaseRad);
            }
            else if (func === 'cos') {
                y = amplitude * Math.cos(t + phaseRad);
            }
            else if (func === 'tan') {
                y = amplitude * Math.tan(t + phaseRad);
                if (Math.abs(y) > 10)
                    continue; // Tangens begrenzen
            }
            if (x === 0) {
                firstY = y;
            }
            const canvasY = centerY - y * (height / 20); // Skalierung
            // edgar-Bild (immer über dem Graphen)
            if (x % 100 === 0 && edgarImage.complete) {
                ctx.drawImage(edgarImage, x - edgarHeight / 2, canvasY - edgarHeight, edgarHeight, edgarHeight);
            }
            // Linie zeichnen
            if (x === 0) {
                ctx.beginPath();
                ctx.moveTo(x, canvasY);
            }
            else {
                ctx.lineTo(x, canvasY);
            }
        }
        ctx.stroke();
        // Update Formel und erster Punkt
        formulaDisplay.textContent = `${amplitude} * ${func}(2π * ${frequency} * x + ${phase}°)`;
        firstXDisplay.textContent = '0';
        firstYDisplay.textContent = firstY.toFixed(0);
    }
    // Funktion: Live-Aktualisierung
    function updateGraph() {
        const amplitude = parseFloat(amplitudeInput.value);
        const frequency = parseFloat(frequencyInput.value);
        const phase = parseFloat(phaseInput.value);
        const func = functionSelect.value;
        drawTrigFunction(amplitude, frequency, phase, func);
    }
    // Event-Listener für Live-Aktualisierung
    amplitudeInput.addEventListener('input', updateGraph);
    frequencyInput.addEventListener('input', updateGraph);
    phaseInput.addEventListener('input', updateGraph);
    functionSelect.addEventListener('input', updateGraph);
    // Erste Zeichnung (Standard: Sinus)
    updateGraph();
};
