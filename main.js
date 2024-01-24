const canvas = document.querySelector("canvas");
canvas.width = 1660;
canvas.height = 930;
const ctx = canvas.getContext("2d");
const fps = 60;

let horizontalDirection = "";
let verticalDirection = "";
let msPrev = performance.now();
const msPerFrame = 1000 / fps;

const spriteImage = new Image();
spriteImage.src = "./assets/sprites.png";

class MyMap {
    constructor() {
        this.position = {
            x: -2800,
            y: -1920,
        };
        this.width = 7000;
        this.height = 4800;
    }

    draw() {}
}

class Player {
    constructor() {
        this.position = {
            x: Math.floor(canvas.width / 2),
            y: Math.floor(canvas.height / 2),
        };

        this.width = 50;
        this.height = 100;
        this.count = 0;
        this.frames = 0;
    }

    draw() {
        let imageSelectY = 0;

        if (horizontalDirection === "right") {
            imageSelectY = 768;
        } else if (horizontalDirection === "left") {
            imageSelectY = 640;
        } else if (verticalDirection === "up") {
            imageSelectY = 896;
        } else if (verticalDirection === "down") {
            imageSelectY = 512;
        }

        ctx.drawImage(
            spriteImage,
            64 * this.frames,
            imageSelectY,
            64,
            128,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
    }

    update() {
        this.count++;
        if (this.count > 3) {
            this.frames++;
            this.count = 0;
        }
        if (this.frames > 7) this.frames = 0;
        this.draw();
    }
}

const player = new Player();
const map = new MyMap();

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
    map.draw();
    player.update();

    if (verticalDirection === "up") {
        map.position.y += 6;
    } else if (verticalDirection === "down") {
        map.position.y -= 6;
    }

    if (horizontalDirection === "left") {
        map.position.x += 6;
    } else if (horizontalDirection === "right") {
        map.position.x -= 6;
    }
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
