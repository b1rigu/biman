const fps = 60;
const playerSpeed = 6;
const tilesPerRowOnMap = 167;
const backgroundScale = 4;
const collisionWidthHeightPx = 16;

const canvas = getCanvas(1024, 576);
const c = getContext2d(canvas);
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

const backgroundImage = createImage("./img/newmap.png");
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
    scale: backgroundScale / 1.5,
});

const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: backgroundImage,
    scale: backgroundScale,
});

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage,
    scale: backgroundScale,
});

const boundaries = getBoundaries(
    22379,
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

        if (!moving) return;

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

animate();

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
