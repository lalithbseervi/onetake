(function () {
    if (!"mediaDevices" in navigator || !"getUserMedia" in navigator.mediaDevices) {
        alert("Webcam could not be accessed.");
        return;
    }
})

const video = document.querySelector('#camera-stream');
const play = document.querySelector('#play');
const pause = document.querySelector('#pause');
const screenshot = document.querySelector('#screenshot');
const changeCam = document.querySelector('#changeCam');
const screenshotContainer = document.querySelector('#screenshotContainer');
const canvas = document.querySelector('#canvas');
const hiddenCanvas = document.querySelector('#hidden-canvas');
const outputCanvas = document.querySelector('#output-canvas');
const hiddenContext = hiddenCanvas.getContext('2d');
const outputContext = outputCanvas.getContext('2d');
const charset = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+<>bcdefgjklnrsyz';

const constraints = {
    audio: false,
    video: {
        width: {
            min: 375,
            width: 365,
            max: 2560,   
        },
        height: {
            min: 660,
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

const getAverageRGB = (frame) => {
    const length = frame.data.length / 4;

    let r = 0;
    let g = 0;
    let b = 0;

    for (let i = 0; i < length; i++) {
        r += frame.data[i * 4 + 0];
        g += frame.data[i * 4 + 1];
        b += frame.data[i * 4 + 2];
    }

    return {
        r: r / length,
        g: g / length,
        b: b / length,
    };
};

const processFrame = () => {
    const fontHeight = 16;
    const {
        videoWidth: width, 
        videoHeight: height,
    } = video;

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

        outputContext.clearRect(0, 0, width, height);

        for(let y = 0; y < height; y += fontHeight) {
            for(let x = 0; x < width; x += fontWidth) {
                const frameSection = hiddenContext.getImageData(x, y, fontWidth, fontHeight);
                const {r, g, b} = getAverageRGB(frameSection);
                const randomChar = charset[Math.floor(Math.random() * charset.length)];

                outputContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
                outputContext.fillText(randomChar, x, y);
            }
        }
    }

    window.requestAnimationFrame(processFrame);
};

play.addEventListener("click", function() {
    video.play();
    play.classList.add("is-hidden");
    pause.classList.remove("is-hidden");
})

pause.addEventListener("click", function () {
    video.pause();
    pause.classList.add("is-hidden");
    play.classList.remove("is-hidden");
});

screenshot.addEventListener("click", function() {
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
    } catch(err) {
        alert("Could not access webcam.");
    }
}

changeCam.addEventListener("click", function() {
    useFrontCamera = !useFrontCamera;
    initializeCamera();
})

video.addEventListener('play', function () {
    window.requestAnimationFrame(processFrame);
    console.log('Live!');
});

initializeCamera();