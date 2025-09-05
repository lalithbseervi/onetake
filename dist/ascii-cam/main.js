/* check whether webcam access is available */
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

let useFrontCamera = true;

// Remove facingMode from constraints here, will set it fresh each time
const baseConstraints = {
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
            min: 5,
            ideal: 10,
            max: 30,
        }
    }
};

let videoStream;

// Initialize the worker (only one worker now)
let worker = new Worker('worker.js');

// Define a smaller sample size for faster processing
const getSampleWidth = () => {
    const screenWidth = window.innerWidth; // Get the device's screen width

    // Set the sampleWidth based on screen width
    if (screenWidth < 600) { // Small devices like phones
        return 50;
    } else if (screenWidth < 1200) { // Tablets and smaller desktops
        return 100;
    } else { // Larger desktops or high-end laptops
        return 150;
    }
};

let sampleWidth = getSampleWidth();
let sampleHeight;

const renderAsciiArt = (asciiResult) => {
    const { videoWidth, videoHeight } = video;
    if (videoWidth && videoHeight && asciiResult) {
        // Use actual video dimensions for canvas
        outputCanvas.width = videoWidth;
        outputCanvas.height = videoHeight;
        // Calculate font size based on video dimensions and sample grid
        const fontHeight = Math.floor(videoHeight / sampleHeight);
        const fontWidth = Math.floor(videoWidth / sampleWidth);
        outputContext.font = `${fontHeight}px monospace`;
        outputContext.clearRect(0, 0, videoWidth, videoHeight);
        for (let y = 0; y < sampleHeight; y++) {
            for (let x = 0; x < sampleWidth; x++) {
                const item = asciiResult[y][x];
                outputContext.fillStyle = item.color;
                outputContext.fillText(item.char, x * fontWidth, y * fontHeight);
            }
        }
    }
};

let lastTime = 0;
const fps = 10; // Limit to 10 frames per second
const interval = 1000 / fps;

const processFrame = () => {
    const { videoWidth, videoHeight } = video;

    if (videoWidth && videoHeight) {
        const aspectRatio = videoWidth / videoHeight;
        sampleHeight = Math.floor(sampleWidth / aspectRatio);

        // Draw the downscaled video frame onto the hidden canvas
        hiddenCanvas.width = sampleWidth;
        hiddenCanvas.height = sampleHeight;
        hiddenContext.drawImage(video, 0, 0, sampleWidth, sampleHeight);

        // Get the image data
        const imageData = hiddenContext.getImageData(0, 0, sampleWidth, sampleHeight);

        // Process the frame with the worker
        worker.postMessage({ imageData, charset, sampleWidth, sampleHeight });

        // Continue the loop for the next frame
        window.requestAnimationFrame(processFrame);
    }
};

// Listen for messages from the worker
worker.onmessage = (event) => {
    const asciiResult = event.data;
    renderAsciiArt(asciiResult);
};

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
    img.src = outputCanvas.toDataURL("image/png");
    screenshotContainer.prepend(img);
});

function stopVideoStream() {
    if (videoStream) {
        videoStream.getTracks().forEach((track) => {
            track.stop();
        });
        videoStream = null;
    }
}

async function initializeCamera() {
    stopVideoStream();
    const constraints = JSON.parse(JSON.stringify(baseConstraints));
    constraints.video.facingMode = useFrontCamera ? "user" : "environment";
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = null;
        video.srcObject = stream;
        videoStream = stream;
        // For cross-browser compatibility, always start video and ASCII loop after loadedmetadata
        video.onloadedmetadata = () => {
            hiddenCanvas.width = video.videoWidth;
            hiddenCanvas.height = video.videoHeight;
            outputCanvas.width = video.videoWidth;
            outputCanvas.height = video.videoHeight;
            video.play();
            window.requestAnimationFrame(processFrame);
        };
    } catch (err) {
        alert("Could not access webcam. Please check your permissions.");
    }
}

changeCam.addEventListener("click", function () {
    useFrontCamera = !useFrontCamera;
    stopVideoStream();
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