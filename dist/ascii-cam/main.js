(function () {
    if (!("mediaDevices" in navigator) || !("getUserMedia" in navigator.mediaDevices)) {
        alert("Webcam could not be accessed.");
        return;
    }
})();

const video = document.querySelector('#camera-stream');
const play = document.querySelector('#play');
const pause = document.querySelector('#pause');
const changeCam = document.querySelector('#changeCam');
const hiddenCanvas = document.querySelector('#hidden-canvas');
const outputCanvas = document.querySelector('#output-canvas');
const hiddenContext = hiddenCanvas.getContext('2d', {willReadFrequently: true});
const outputContext = outputCanvas.getContext('2d', {willReadFrequently: true});
const charset = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+<>bcdefgjklnrsyz';

const constraints = {
    audio: false,
    video: {
        width: {min: window.innerWidth},
        height: {min: window.innerHeight},
        frameRate: { min: 30, ideal: 40, max: 50 },
    },
};

let useFrontCamera = true;
let videoStream;

// Function to calculate average RGB of a section
const getAverageRGB = (frame) => {
    const length = frame.data.length / 4;
    let r = 0, g = 0, b = 0;
    for (let i = 0; i < length; i++) {
        r += frame.data[i * 4 + 0];
        g += frame.data[i * 4 + 1];
        b += frame.data[i * 4 + 2];
    }
    return { r: r / length, g: g / length, b: b / length };
};

// Function to handle frame processing
const processFrame = () => {
    const fontHeight = 27;

    const { videoWidth: width, videoHeight: height } = video;
    if (width && height) {
        hiddenCanvas.width = width;
        hiddenCanvas.height = height;
        outputCanvas.width = width;
        outputCanvas.height = height;
        hiddenContext.drawImage(video, 0, 0, width, height);
        outputContext.textBaseline = 'top';
        outputContext.font = `${fontHeight}px Consolas`;
        const text = outputContext.measureText('@');
        const fontWidth = parseInt(text.width);
        outputContext.clearRect(0, 0, width, height); // Clear previous frame
        
        // Loop through the canvas and convert pixels to ASCII
        for (let y = 0; y < height; y += fontHeight) {
            for (let x = 0; x < width; x += fontWidth) {
                const frameSection = hiddenContext.getImageData(x, y, fontWidth, fontHeight, { willReadFrequently: true });
                const { r, g, b } = getAverageRGB(frameSection);
                const randomChar = charset[Math.floor(Math.random() * charset.length)];
                outputContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
                outputContext.fillText(randomChar, x, y);
            }
        }
    }
    window.requestAnimationFrame(processFrame);
};

// Start and pause video stream
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

// Initialize video stream
function stopVideoStream(videoStream) {
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
        // Dynamically scale canvas and video to window size
        video.addEventListener('loadedmetadata', () => {
            hiddenCanvas.width = video.videoWidth;
            hiddenCanvas.height = video.videoHeight;
            outputCanvas.width = video.videoWidth;
            outputCanvas.height = video.videoHeight;
        });
    } catch (err) {
        alert("Could not access webcam.");
    }
}

// Switch between front and rear cameras
changeCam.addEventListener("click", function () {
    useFrontCamera = !useFrontCamera;
    initializeCamera();
});

// Start frame processing when video starts playing
video.addEventListener('play', function () {
    window.requestAnimationFrame(processFrame); // Start ASCII processing
    console.log('Live!');
});

// Call initializeCamera immediately to start the stream
initializeCamera();
window.requestAnimationFrame(processFrame);
