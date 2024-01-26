const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 567;
const ctx = canvas.getContext("2d");
const fps = 60;
const msPerFrame = 1000 / fps;
let msPrev = performance.now();
ctx.imageSmoothingEnabled = false;

let horizontalDirection = "";
let verticalDirection = "";

const gg = new Image();
gg.src = "./assets/what.png"

class Player {
    constructor() {
        this.position = {
            x: Math.floor(canvas.width / 2),
            y: Math.floor(canvas.height / 2),
        };

        this.width = 50;
        this.height = 50;
    }

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();

function mainLoop() {
    requestAnimationFrame(mainLoop);

    // constantly run fps at desired value
    const msNow = performance.now();
    const msPassed = msNow - msPrev;

    if (msPassed < msPerFrame) return;

    const excessTime = msPassed % msPerFrame;
    msPrev = msNow - excessTime;
    // constantly run fps at desired value

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(gg, -1300, -1200, 1792 * 4, 768 * 4);
    player.draw();
}

mainLoop();

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            verticalDirection = "up";
            break;
        case "a":
            horizontalDirection = "left";
            break;
        case "s":
            verticalDirection = "down";
            break;
        case "d":
            horizontalDirection = "right";
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w":
            verticalDirection = "";
            break;
        case "a":
            horizontalDirection = "";
            break;
        case "s":
            verticalDirection = "";
            break;
        case "d":
            horizontalDirection = "";
            break;
    }
});
