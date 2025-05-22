// asciiWorker.js
self.onmessage = function (e) {
    const { imageData, width, height, fontWidth, fontHeight, charset } = e.data;

    const output = [];
    const data = imageData.data;

    for (let y = 0; y < height; y += fontHeight) {
        for (let x = 0; x < width; x += fontWidth) {
            let r = 0, g = 0, b = 0, count = 0;
            for (let j = 0; j < fontHeight; j++) {
                for (let i = 0; i < fontWidth; i++) {
                    const px = ((y + j) * width + (x + i)) * 4;
                    if (px < data.length - 4) {
                        r += data[px];
                        g += data[px + 1];
                        b += data[px + 2];
                        count++;
                    }
                }
            }
            if (count > 0) {
                r = r / count;
                g = g / count;
                b = b / count;
            }

            const char = charset[Math.floor(Math.random() * charset.length)];
            output.push({ x, y, char, color: `rgb(${r}, ${g}, ${b})` });
        }
    }

    self.postMessage({ output });
};
