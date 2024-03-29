const physicsFPS = 60;
const maxPlayerSpeed = 5;
const tilesPerRowOnMap = 167;
const backgroundScale = 3;
const collisionWidthHeightPx = 16;
const collisionSymbol = 22379;
const canvasWidth = 1024;
const canvasHeight = 576;
const defaultFrameSpeed = 8;

const mainCanvas = document.querySelector("canvas");
mainCanvas.width = canvasWidth;
mainCanvas.height = canvasHeight;
const mainContext = getContext2d(mainCanvas);
const backgroundCanvas = document.createElement("canvas");
backgroundCanvas.width = canvasWidth;
backgroundCanvas.height = canvasHeight;
const backgroundContext = getContext2d(backgroundCanvas);

let currentPlayerSpeed = maxPlayerSpeed;

const offset = {
    x: backgroundCanvas.width / 2 - 1767 * backgroundScale,
    y: backgroundCanvas.height / 2 - 914 * backgroundScale,
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
const shadowImage = createImage("./img/shadow.png");
const fogImage = createImage("./img/fog.png");
const gunImage = createImage("./img/pistol.png");
const gunMirroredImage = createImage("./img/pistolMirrored.png");
const bulletImage = createImage("./img/pistolAmmo.png");

const player = new Player({
    position: {
        x: backgroundCanvas.width / 2 - ((backgroundScale - 1) * 16) / 2,
        y: backgroundCanvas.height / 2 - ((backgroundScale - 1) * 16) / 2,
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

const gun = new Gun({
    position: {
        x: backgroundCanvas.width / 2,
        y: backgroundCanvas.height / 2 + 12,
    },
    image: gunImage,
    frames: {
        max: 12,
    },
    sprites: {
        mirrored: gunMirroredImage,
    },
    scale: backgroundScale - 2.5,
    extras: {
        degree: 0,
    },
    frameSpeed: 1,
});

const shadow = new Sprite({
    position: {
        x: backgroundCanvas.width / 2 - 12,
        y: backgroundCanvas.height / 2 + 8,
    },
    image: shadowImage,
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
background.animating = true;

const fog = new Sprite({
    position: {
        x: -500,
        y: -500,
    },
    image: fogImage,
    scale: 3,
});

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
rain.animating = true;

const boundaries = getBoundaries(
    collisionSymbol,
    collisionWidthHeightPx,
    backgroundScale,
    offset,
    tilesPerRowOnMap
);

const movables = [background, ...boundaries, foreground];

let storySequencyTimelineIndex = 0;
function storySequencePlayer() {
    backgroundContext.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    switch (storySequencyTimelineIndex) {
        case 0:
            animationLoop();
            physicsLoop();
            // backgroundContext.fillStyle = "white";
            // backgroundContext.font = "40px arial";
            // let textString = "Year 2023, Someplace in the countryside";
            // const textWidth = backgroundContext.measureText(textString).width;
            // backgroundContext.fillText(
            //     textString,
            //     backgroundCanvas.width / 2 - textWidth / 2,
            //     backgroundCanvas.height / 2
            // );
            // mainContext.drawImage(backgroundCanvas, 0, 0);
            // setTimeout(() => {
            //     storySequencyTimelineIndex++;
            //     storySequencePlayer();
            // }, 5000);
            break;
        case 1:
            // TODO
            break;
    }
}

const bullets = [];

function animationLoop() {
    requestAnimationFrame(animationLoop);

    background.draw();
    shadow.draw();
    player.draw();
    for (const bullet of bullets) {
        bullet.draw();
    }
    gun.draw();
    foreground.draw();
    fog.draw();
    rain.draw();

    mainContext.drawImage(backgroundCanvas, 0, 0);  
}

function physicsLoop() {
    requestAnimationFrame(physicsLoop);

    if (!canRunLoop(physicsFPS)) return;

    background.update();
    shadow.update();
    player.update();
    for (const bullet of bullets) {
        bullet.update();
    }
    gun.update();
    foreground.update();
    fog.update();
    rain.update();

    movementCalc();
}

function movementCalc() {
    player.animating = false;

    if (!keys.w.pressed && !keys.s.pressed && !keys.a.pressed && !keys.d.pressed) return;

    player.animating = true;

    let canMoveHorizontally = true;
    let canMoveVertically = true;
    let needToCheckHorizontal = true;
    let needToCheckVertical = true;

    for (const boundary of boundaries) {
        if (needToCheckHorizontal && checkHorizontalCollision(player, boundary)) {
            canMoveHorizontally = false;
            needToCheckHorizontal = false;
        }
        if (needToCheckVertical && checkVerticalCollision(player, boundary)) {
            canMoveVertically = false;
            needToCheckVertical = false;
        }

        if (!needToCheckHorizontal && !needToCheckVertical) break;
    }

    if (!canMoveHorizontally && !canMoveVertically) {
        player.animating = false;
        return;
    }

    for (const movable of movables) {
        if (canMoveVertically) {
            if (keys.w.pressed) {
                player.image = player.sprites.up;
                movable.position.y += currentPlayerSpeed;
            }
            if (keys.s.pressed) {
                player.image = player.sprites.down;
                movable.position.y -= currentPlayerSpeed;
            }
        }

        if (canMoveHorizontally) {
            if (keys.a.pressed) {
                player.image = player.sprites.left;
                movable.position.x += currentPlayerSpeed;
            }
            if (keys.d.pressed) {
                player.image = player.sprites.right;
                movable.position.x -= currentPlayerSpeed;
            }
        }
    }
}

document.addEventListener("keydown", (event) => {
    event.preventDefault();
    switch (event.key.toLowerCase()) {
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
        case "shift":
            currentPlayerSpeed = maxPlayerSpeed / 2;
            player.frameSpeed = defaultFrameSpeed * 2;
            break;
    }
});

document.addEventListener("keyup", (event) => {
    event.preventDefault();
    switch (event.key.toLowerCase()) {
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
        case "shift":
            currentPlayerSpeed = maxPlayerSpeed;
            player.frameSpeed = defaultFrameSpeed;
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
    storySequencePlayer();
});

mainCanvas.addEventListener("mousemove", (event) => {
    let delta = {
        x: event.offsetX - backgroundCanvas.width / 2,
        y: event.offsetY - backgroundCanvas.height / 2,
    };
    gun.extras.degree = (Math.atan2(delta.y, delta.x) * 180) / Math.PI;
});

mainCanvas.addEventListener("mousedown", (event) => {
    const delta = {
        x: event.offsetX - backgroundCanvas.width / 2,
        y: event.offsetY - backgroundCanvas.height / 2,
    };
    const angle = Math.atan2(delta.y, delta.x);

    const vx = Math.cos(angle - 45 * Math.PI) * 100;
    const vy = Math.sin(angle - 45 * Math.PI) * 100;

    if (!gun.animating) {
        bullets.push(
            new Bullet({
                position: {
                    x: backgroundCanvas.width / 2,
                    y: backgroundCanvas.height / 2 + 8,
                },
                image: bulletImage,
                goingVelocity: {
                    x: vx,
                    y: vy,
                },
                degree: gun.extras.degree,
            })
        );
        audio.pistolShoot.play();

        gun.animating = true;
    }
});
