const canvas = document.querySelector("canvas");
canvas.width = 1660;
canvas.height = 930;
const ctx = canvas.getContext("2d");

let horizontalDirection: "left" | "right" | "" = "";
let verticalDirection: "up" | "down" | "" = "";

class Player {
    position: {
        x: number;
        y: number;
    };

    velocity: {
        x: number;
        y: number;
    };

    width: number;
    height: number;

    constructor() {
        this.position = {
            x: 100,
            y: 100,
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 30;
        this.height = 30;
    }

    draw() {
        if (ctx) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    }

    update() {
        this.draw();

        console.log(this.position.x + this.width + this.velocity.x);
        console.log(this.position.y + this.height + this.velocity.y);

        if (
            this.position.x + this.velocity.x >= 0 &&
            this.position.x + this.width + this.velocity.x <= canvas.width
        ) {
            this.position.x += this.velocity.x;
        }

        if (
            this.position.y + this.height + this.velocity.y <= canvas.height &&
            this.position.y + this.velocity.y >= 0
        ) {
            this.position.y += this.velocity.y;
        }
    }
}

const player = new Player();

function mainLoop() {
    requestAnimationFrame(mainLoop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    player.update();

    if (verticalDirection === "up") {
        player.velocity.y = -10;
    } else if (verticalDirection === "down") {
        player.velocity.y = 10;
    } else {
        player.velocity.y = 0;
    }

    if (horizontalDirection === "left") {
        player.velocity.x = -10;
    } else if (horizontalDirection === "right") {
        player.velocity.x = 10;
    } else {
        player.velocity.x = 0;
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
