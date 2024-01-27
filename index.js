const fps = 60;
const playerSpeed = 5;
const tilesPerRowOnMap = 70;


const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
const msPerFrame = 1000 / fps;
let msPrev = performance.now();
c.imageSmoothingEnabled = false;


const offset = {
    x: -740,
    y: -650,
};

const collisionsMap = [];

for (let i = 0; i < collisions.length; i += tilesPerRowOnMap) {
    collisionsMap.push(collisions.slice(i, i + tilesPerRowOnMap));
}

const boundaries = [];

collisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 1025) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y,
                    },
                })
            );
        }
    });
});

let keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    s: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            keys.w.pressed = true;
            break;
        case "a":
            keys.a.pressed = true;
            break;
        case "s":
            keys.s.pressed = true;
            break;
        case "d":
            keys.d.pressed = true;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w":
            keys.w.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "s":
            keys.s.pressed = false;
            break;
        case "d":
            keys.d.pressed = false;
            break;
    }
});

const backgroundImage = new Image();
backgroundImage.src = "./img/Pellet Town.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 8,
        y: canvas.height / 2 - 68 / 2,
    },
    image: playerDownImage,
    frames: {
        max: 4,
    },
    sprites: {
        up: playerUpImage,
        down: playerDownImage,
        left: playerLeftImage,
        right: playerRightImage,
    },
});

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: backgroundImage,
    scale: 4,
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage,
    scale: 4,
});

const movables = [background, ...boundaries, foreground];

function isRectangularsColliding({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}

function animate() {
    requestAnimationFrame(animate);

    // constantly run fps at desired value
    const msNow = performance.now();
    const msPassed = msNow - msPrev;

    if (msPassed < msPerFrame) return;

    const excessTime = msPassed % msPerFrame;
    msPrev = msNow - excessTime;
    // constantly run fps at desired value

    background.draw();
    boundaries.forEach((boundary) => {
        boundary.draw();
    });
    player.draw();
    foreground.draw();

    player.moving = false;

    if (keys.w.pressed || keys.s.pressed || keys.a.pressed || keys.d.pressed) {
        player.moving = true;
        let moving = true;

        for (let i = 0; i < boundaries.length; i++) {
            const boundaryCopied = JSON.parse(JSON.stringify(boundaries[i]));
            if (keys.w.pressed) {
                boundaryCopied.position.y += playerSpeed;
            }
            if (keys.s.pressed) {
                boundaryCopied.position.y -= playerSpeed;
            }
            if (keys.a.pressed) {
                boundaryCopied.position.x += playerSpeed;
            }
            if (keys.d.pressed) {
                boundaryCopied.position.x -= playerSpeed;
            }

            if (
                isRectangularsColliding({
                    rectangle1: player,
                    rectangle2: boundaryCopied,
                })
            ) {
                moving = false;
                break;
            }
        }

        if (moving) {
            movables.forEach((movable) => {
                if (keys.w.pressed) {
                    player.image = player.sprites.up;
                    movable.position.y += playerSpeed;
                }
                if (keys.s.pressed) {
                    player.image = player.sprites.down;
                    movable.position.y -= playerSpeed;
                }
                if (keys.a.pressed) {
                    player.image = player.sprites.left;
                    movable.position.x += playerSpeed;
                }
                if (keys.d.pressed) {
                    player.image = player.sprites.right;
                    movable.position.x -= playerSpeed;
                }
            });
        }
    }
}

animate();
