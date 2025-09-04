// worker.js

// This function is run on a separate thread
const getGrayscaleValue = (r, g, b) => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
    const { imageData, charset, sampleWidth, sampleHeight } = event.data;
    const data = imageData.data;
    const asciiResult = [];

    // Iterate through the smaller hidden canvas to generate ASCII art
    for (let y = 0; y < sampleHeight; y++) {
        const line = [];
        for (let x = 0; x < sampleWidth; x++) {
            const pixelIndex = ((y * sampleWidth) + x) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];

            const brightness = getGrayscaleValue(r, g, b);
            const charIndex = Math.floor((brightness / 255) * (charset.length - 1));
            const asciiChar = charset[charIndex];

            // Store the character and color
            line.push({ char: asciiChar, color: `rgb(${r}, ${g}, ${b})` });
        }
        asciiResult.push(line);
    }
    
    // Send the processed result back to the main thread
    self.postMessage(asciiResult);
});