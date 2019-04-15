const canvas = document.getElementById('canvas-snow-fall');
const canvasHeap = document.getElementById('canvas-snow-heap');
const ctx = canvas.getContext('2d');
const ctxHeap = canvasHeap.getContext('2d');
const requestAnimationFrame = window.requestAnimationFrame;

const targetImg = new Image();

const flakesCount = 150;
const imgScale = 1.5;

//control config default

const config = {
    glide: 2,
    softness: 0.5,
    speed: 5,
    flakeMaxSize: 8,
    opacityRange: 0.7,
    nonStickOpacity: 0.4
};

//setup canvas, image and resopnsive

targetImg.src = 'mac.png';
targetImg.onload = () => {
    targetImg.proportion = targetImg.naturalHeight / targetImg.naturalWidth;
    setImgDimensions(targetImg, imgScale, targetImg.proportion)
};

function setCanvasDimensions() {
    canvas.width = canvasHeap.width = window.innerWidth;
    canvas.height = canvasHeap.height = window.innerHeight;
    setImgDimensions(targetImg, imgScale, targetImg.proportion);
};
setCanvasDimensions();

function setImgDimensions(img, scale, imgProportion) {
    if (window.innerHeight > window.innerWidth) {
        img.width = window.innerWidth / scale;
        img.height = img.width * imgProportion;
    } else {
        img.width = window.innerHeight / scale;
        img.height = img.width * imgProportion;
    }
    ctxHeap.drawImage(img, (canvasHeap.width - img.width) / 2, canvasHeap.height - img.height, img.width, img.height);
}

window.addEventListener('resize', setCanvasDimensions);

//utils

function getRandomInteger(from, to) {
    return Math.round(Math.random() * (to - from) + from);
}

function isEmptyZone(ctx, x, y) {
    return ctx.getImageData(x, y, 1, 1).data.join() == '0,0,0,0';
}

//flakes

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
        if (Number(this.opacity) > config.nonStickOpacity) {
            this.checkHeap();
        }

        if (this.y >= canvas.height) {
            if (Number(this.opacity) > config.nonStickOpacity) {
                this.putToHeap();
            }
            this.resetFlake();
        }
    }

    resetFlake() {
        this.radius = getRandomInteger(1, config.flakeMaxSize);
        this.opacity = ((Math.random() * config.opacityRange) + (1 - config.opacityRange)).toFixed(1);
        this.speed = getRandomInteger(1, config.speed);
        this.y = 0;
        this.x = Math.round(Math.random() * canvas.width);
    }

    checkHeap() {
        if (!isEmptyZone(ctxHeap, this.x, this.y - this.radius * config.softness)) {
            if (isEmptyZone(ctxHeap, this.x + config.glide, this.y - this.radius * config.softness)) {
                this.x += config.glide;
            }
            else if (isEmptyZone(ctxHeap, this.x - config.glide, this.y - this.radius * config.softness)) {
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

//flakes create

var flakes = [];
for (let i = 0; i <= flakesCount; i++) {
    flakes.push(new Flake());
}

//wind

let windDir = 'none';

function wind() {
    setTimeout(() => {
        let x = Math.random();
        if (x < 0.3) {
            windDir = 'left';
        } else if (x > 0.7) {
            windDir = 'right';
        } else {
            windDir = 'none';
        }
        console.log('wind:' + windDir);
        wind();
    }, 3000);
}

//flakes animation

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.map((flake) => {
        flake.checkFlakeState();
        flake.draw();
        flake.y += flake.speed;

        if (windDir == 'left') {
            flake.x -= .5;
        } else if (windDir == 'right') {
            flake.x += .5;
        }
    })
    requestAnimationFrame(snow);
}

snow();
wind();


//controls init

const gui = new dat.GUI();

gui.add(config, 'glide', 0, 5).step(1);
gui.add(config, 'softness', 0, 1).step(0.1);
gui.add(config, 'speed', 1, 10).step(1);
gui.add(config, 'flakeMaxSize', 1, 10).step(1);
gui.add(config, 'opacityRange', 0.1, 1).step(0.1);
gui.add(config, 'nonStickOpacity', 0, 1).step(0.1);

