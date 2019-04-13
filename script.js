const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const requestAnimationFrame = window.requestAnimationFrame;

const flakesCount = 100;

function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasDimensions();
// window.addEventListener('resize', setCanvasDimensions);

function getRandomNum(from, to) {
    return Math.random()
}

class Flake {
    constructor() {
        this.radius = Math.floor((Math.random() * (10 - 5)) + 5);
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    };

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

var flakes = [];
for (let i = 0; i <= flakesCount; i++) {
    flakes.push(new Flake());
}

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flakes.forEach((flake) => {
        flake.draw();
        flake.y++;
    })
    requestAnimationFrame(snow);
}

snow();
