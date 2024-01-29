const fps = 60;
const playerSpeed = 5;
const tilesPerRowOnMap = 167;
const backgroundScale = 3;
const collisionWidthHeightPx = 16;
const collisionSymbol = 22379;

const canvas = getCanvas(1024, 576);
const context = getContext2d(canvas);
const backgroundCanvas = document.createElement("canvas");
backgroundCanvas.width = 1024;
backgroundCanvas.height = 576;
const backgroundContext = getContext2d(backgroundCanvas);

const offset = {
    x: canvas.width / 2 - 1767 * backgroundScale,
    y: canvas.height / 2 - 914 * backgroundScale,
};

const keys = {
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

const rainImage = createImage("./img/rain7.png");
const backgroundImage = createImage("./img/maprain.png");
const foregroundImage = createImage("./img/foreground.png");
const playerDownImage = createImage("./img/playerDown.png");
const playerUpImage = createImage("./img/playerUp.png");
const playerLeftImage = createImage("./img/playerLeft.png");
const playerRightImage = createImage("./img/playerRight.png");

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 64 / 8,
        y: canvas.height / 2 - 16 / 2,
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
    scale: backgroundScale - 1,
});

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    frames: {
        max: 3,
    },
    image: backgroundImage,
    scale: backgroundScale,
    frameSpeed: 15,
});
background.moving = true;

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage,
    scale: backgroundScale,
});

const rain = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    image: rainImage,
    frames: {
        max: 5,
    },
    scale: 2,
});
rain.moving = true;

const boundaries = getBoundaries(
    collisionSymbol,
    collisionWidthHeightPx,
    backgroundScale,
    offset,
    tilesPerRowOnMap
);

const movables = [background, ...boundaries, foreground];

function animate() {
    requestAnimationFrame(animate);

    if (!canRunLoop(fps)) return;

    background.draw();
    for (const boundary of boundaries) {
        boundary.draw();
    }
    player.draw();
    foreground.draw();
    rain.draw();

    context.drawImage(backgroundCanvas, 0, 0);

    player.moving = false;

    if (!keys.w.pressed && !keys.s.pressed && !keys.a.pressed && !keys.d.pressed) return;

    player.moving = true;

    for (const boundary of boundaries) {
        const boundaryCopied = {
            position: { x: boundary.position.x, y: boundary.position.y },
            width: boundary.width,
            height: boundary.height,
        };
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
            player.moving = false;
            break;
        }
    }

    if (!player.moving) return;

    for (const movable of movables) {
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
    }
}

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

let clicked = false;
document.querySelector(".play-button").addEventListener("click", (_) => {
    if (!clicked) {
        audio.map.play("main");
        clicked = true;
    }
    document.querySelector(".main-menu").style.display = "none";
    document.querySelector("canvas").style.display = "block";
    animate();
});
