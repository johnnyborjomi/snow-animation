const canvas = document.getElementById('canvas-snow-fall');
const canvasHeap = document.getElementById('canvas-snow-heap');
const ctx = canvas.getContext('2d');
const ctxHeap = canvasHeap.getContext('2d');
const requestAnimationFrame = window.requestAnimationFrame;

(function setCanvasDimensions() {
    canvas.width = canvasHeap.width = window.innerWidth;
    canvas.height = canvasHeap.height = window.innerHeight;
})();

const flakesCount = 100;

const macImg = new Image();
macImg.src = 'mac.png';
macImg.width = 305;
macImg.height = 244;

macImg.addEventListener('load', () => {
    ctxHeap.drawImage(macImg, (canvasHeap.width - macImg.width) / 2, canvasHeap.height - macImg.height, macImg.width, macImg.height);
});

// window.addEventListener('resize', setCanvasDimensions);

function getRandomInteger(from, to) {
    return Math.round(Math.random() * (to - from) + from);
}

class Flake {
    constructor() {
        this.radius = getRandomInteger(3, 8);
        this.x = Math.round(Math.random() * canvas.width);
        this.y = Math.round(Math.random() * canvas.height);
        this.opacity = ((Math.random() * 0.5) + 0.5).toFixed(1);
        this.speed = getRandomInteger(1, 5);
    };

    draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    checkFlakeState() {

        if (this.y >= canvas.height) {
            if (Number(this.opacity) > 0.7) {
                ctxHeap.fillStyle = 'white';
                ctxHeap.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctxHeap.fill();
            }
            this.y = 0;
            this.x = Math.round(Math.random() * canvas.width);
        }

    }
}

var flakes = [];
for (let i = 0; i <= flakesCount; i++) {
    flakes.push(new Flake());
}

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.forEach((flake) => {
        flake.checkFlakeState();
        flake.draw();
        flake.y += flake.speed;
    })
    requestAnimationFrame(snow);
}

snow();
