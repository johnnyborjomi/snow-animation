const canvas = document.getElementById('canvas-snow-fall');
const canvasHeap = document.getElementById('canvas-snow-heap');
const ctx = canvas.getContext('2d');
const ctxHeap = canvasHeap.getContext('2d');
const requestAnimationFrame = window.requestAnimationFrame;
const config = {
    glide: 2,
    softness: 0.5,
    speed: 5,
    flakeSizeMin: 1,
    flakeSizeMax: 8
};

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
        this.resetFlake();
        this.x = Math.round(Math.random() * canvas.width);
        this.y = Math.round(Math.random() * canvas.height);
    };

    draw() {
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    checkFlakeState() {
        if (Number(this.opacity) > 0.7) {
            this.checkHeap();
        }

        if (this.y >= canvas.height) {
            if (Number(this.opacity) > 0.7) {
                this.putToHeap();
            }
            this.resetFlake();
        }
    }

    resetFlake() {
        this.radius = getRandomInteger(config.flakeSizeMin, config.flakeSizeMax);
        this.opacity = ((Math.random() * 0.5) + 0.5).toFixed(1);
        this.speed = getRandomInteger(1, config.speed);
        this.y = 0;
        this.x = Math.round(Math.random() * canvas.width);
    }

    checkHeap() {
        if (ctxHeap.getImageData(this.x, this.y - this.radius * config.softness, 1, 1).data.join() != [0, 0, 0, 0].join()) {
            if (ctxHeap.getImageData(this.x + config.glide, this.y - this.radius * config.softness, 1, 1).data.join() == [0, 0, 0, 0].join()) {
                this.x += config.glide;
            }
            else if (ctxHeap.getImageData(this.x - config.glide, this.y - this.radius * config.softness, 1, 1).data.join() == [0, 0, 0, 0].join()) {
                this.x -= config.glide;
            }
            else {
                this.putToHeap();
                this.resetFlake();
            }
        }
    }

    putToHeap() {
        ctxHeap.fillStyle = 'white';
        ctxHeap.beginPath();
        ctxHeap.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctxHeap.fill();
    }

}

var flakes = [];
for (let i = 0; i <= flakesCount; i++) {
    flakes.push(new Flake());
}

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.map((flake) => {
        flake.checkFlakeState();
        flake.draw();
        flake.y += flake.speed;
    })
    requestAnimationFrame(snow);
}

snow();



var gui = new dat.GUI();

gui.add(config, 'glide', 0, 5).step(1);
gui.add(config, 'softness', 0, 1).step(0.1);
gui.add(config, 'speed', 1, 10).step(1);
gui.add(config, 'flakeSizeMin', 1, 10).step(1);
gui.add(config, 'flakeSizeMax', 1, 10).step(1);

