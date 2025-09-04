// main.js

(function () {
    if (!"mediaDevices" in navigator || !"getUserMedia" in navigator.mediaDevices) {
        alert("Webcam could not be accessed.");
        return;
    }
})();

const video = document.querySelector('#camera-stream');
const play = document.querySelector('#play');
const pause = document.querySelector('#pause');
const screenshot = document.querySelector('#screenshot');
const changeCam = document.querySelector('#changeCam');
const charsetSelect = document.querySelector('#charset-select');
const screenshotContainer = document.querySelector('#screenshotContainer');
const canvas = document.querySelector('#canvas');
const hiddenCanvas = document.querySelector('#hidden-canvas');
const outputCanvas = document.querySelector('#output-canvas');
const hiddenContext = hiddenCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');

const charsets = {
    'default': '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+<>bcdefgjklnrsyz',
    'grunge': '@#%*+=-:. ',
    'fine-art': '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^` ',
    'retro-terminal': '█▓▒░ ',
    'blocky': '██▓▒░',
    'symbolic': '&$#*+=-^`',
    'light-and-flowing': 'MWMWli!.,` ',
    'punctuation': '#@:;,. ',
    'monospace': 'qmnbvzxli., ',
    'hand-drawn': '()<>[]{}||~`'
};

let charset = charsets['default'];

const constraints = {
    audio: false,
    video: {
        width: {
            min: 375,
            ideal: 375,
            max: 2560,
        },
        height: {
            min: 700,
            ideal: 864,
            max: 1440,
        },
        frameRate: {
            min: 10,
            ideal: 20,
            max: 30,
        },
    },
};

let useFrontCamera = true;
let videoStream;

// Create the Web Worker
const worker = new Worker('worker.js');

// Define a smaller sample size for faster processing
const sampleWidth = 100;
let sampleHeight;

const renderAsciiArt = (asciiResult) => {
    const { videoWidth, videoHeight } = video;

    if (videoWidth && videoHeight && asciiResult) {
        outputCanvas.width = videoWidth;
        outputCanvas.height = videoHeight;
        outputContext.textBaseline = 'top';

        const fontHeight = Math.ceil(videoHeight / sampleHeight);
        const fontWidth = Math.ceil(videoWidth / sampleWidth);
        outputContext.font = `${fontHeight}px Consolas`;
        outputContext.clearRect(0, 0, videoWidth, videoHeight);

        // Iterate through the result from the worker and draw to the canvas
        for (let y = 0; y < sampleHeight; y++) {
            for (let x = 0; x < sampleWidth; x++) {
                const item = asciiResult[y][x];
                outputContext.fillStyle = item.color;
                outputContext.fillText(item.char, x * fontWidth, y * fontHeight);
            }
        }
    }
};

const processFrame = () => {
    const { videoWidth, videoHeight } = video;

    if (videoWidth && videoHeight) {
        // Calculate sample height
        const aspectRatio = videoWidth / videoHeight;
        sampleHeight = Math.floor(sampleWidth / aspectRatio);

        // Draw the downscaled video frame onto the hidden canvas
        hiddenCanvas.width = sampleWidth;
        hiddenCanvas.height = sampleHeight;
        hiddenContext.drawImage(video, 0, 0, sampleWidth, sampleHeight);

        // Get the downscaled image data and send it to the worker
        const imageData = hiddenContext.getImageData(0, 0, sampleWidth, sampleHeight);
        worker.postMessage({ imageData, charset, sampleWidth, sampleHeight });
    }
    // Continue the loop for the next frame
    window.requestAnimationFrame(processFrame);
};

// Listen for messages (the processed ASCII data) from the worker
worker.addEventListener('message', (event) => {
    const asciiResult = event.data;
    renderAsciiArt(asciiResult);
});

play.addEventListener("click", function () {
    video.play();
    play.classList.add("is-hidden");
    pause.classList.remove("is-hidden");
});

pause.addEventListener("click", function () {
    video.pause();
    pause.classList.add("is-hidden");
    play.classList.remove("is-hidden");
});

screenshot.addEventListener("click", function () {
    const img = document.createElement("img");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    img.src = canvas.toDataURL("image/png");
    screenshotContainer.prepend(img);
});

function stopVideoStream() {
    if (videoStream) {
        videoStream.getTracks().forEach((track) => {
            track.stop();
        });
    }
}

async function initializeCamera() {
    stopVideoStream();
    constraints.video.facingMode = useFrontCamera ? "user" : "environment";
    try {
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = videoStream;
    } catch (err) {
        alert("Could not access webcam.");
    }
}

changeCam.addEventListener("click", function () {
    useFrontCamera = !useFrontCamera;
    initializeCamera();
});

charsetSelect.addEventListener('change', (event) => {
    charset = charsets[event.target.value];
});

video.addEventListener('play', function () {
    window.requestAnimationFrame(processFrame);
    console.log('Live!');
});

initializeCamera();