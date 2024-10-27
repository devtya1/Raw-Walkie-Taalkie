const audio = document.getElementById('audio');
const playButton = document.getElementById('play');
const pauseButton = document.getElementById('pause');
const stopButton = document.getElementById('stop');
const soundwave = document.querySelector('.soundwave');
const radarOverlay = document.querySelector('.radar-overlay');

// Create an audio context and analyzer
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 64;
const bufferLength = analyzer.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Connect audio source to analyzer
const source = audioContext.createMediaElementSource(audio);
source.connect(analyzer);
analyzer.connect(audioContext.destination);

// Generate bars for the soundwave
for (let i = 0; i < bufferLength; i++) {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    soundwave.appendChild(bar);
}

// Get all bars
const bars = document.querySelectorAll('.bar');

// Update bars based on audio data
function animateBars() {
    analyzer.getByteFrequencyData(dataArray);
    bars.forEach((bar, index) => {
        const height = dataArray[index];
        bar.style.height = `${height / 2}px`;
    });
    requestAnimationFrame(animateBars);
}

// Play audio and start animation
playButton.addEventListener('click', () => {
    audioContext.resume().then(() => {
        audio.play();
        animateBars();
        createPing();
    });
});

// Pause audio
pauseButton.addEventListener('click', () => {
    audio.pause();
});

// Stop audio and reset bars
stopButton.addEventListener('click', () => {
    audio.pause();
    audio.currentTime = 0;
    bars.forEach(bar => bar.style.height = '5px');
});

// Function to create radar ping
function createPing() {
    const ping = document.createElement('div');
    ping.classList.add('ping');
    const size = Math.random() * 10 + 5;
    ping.style.width = `${size}px`;
    ping.style.height = `${size}px`;
    ping.style.top = `${Math.random() * 100}%`;
    ping.style.left = `${Math.random() * 100}%`;
    radarOverlay.appendChild(ping);

    setTimeout(() => {
        ping.remove();
    }, 2000); // Ping disappears after 2 seconds
}

// Create a new ping every second
setInterval(createPing, 1000);
