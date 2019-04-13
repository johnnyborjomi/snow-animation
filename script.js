const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const requestAnimationFrame = window.requestAnimationFrame;

function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasDimensions();
// window.addEventListener('resize', setCanvasDimensions);

class Flake {
    constructor() {
        this.radius = 10;
        this.x = 50;
        this.y = 50;
    };

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

var flake = new Flake();

function snow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    flake.draw();
    flake.y++;


    requestAnimationFrame(snow);
}

snow();
