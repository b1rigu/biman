let msPrev = performance.now();
function canRunLoop(fps) {
    const msPerFrame = 1000 / fps;

    const msNow = performance.now();
    const msPassed = msNow - msPrev;

    if (msPassed < msPerFrame) return false;

    const excessTime = msPassed % msPerFrame;
    msPrev = msNow - excessTime;

    return true;
}

function isRectangularsColliding({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    );
}

function getContext2d(canvas) {
    const context = canvas.getContext("2d", { alpha: false });
    context.imageSmoothingEnabled = false;
    return context;
}

function getBoundaries(
    searchSymbol,
    collisionWidthHeightPx,
    backgroundScale,
    offset,
    tilesPerRowOnMap
) {
    const collisionWidthHeightScaled = collisionWidthHeightPx * backgroundScale;

    const collisionsMap = [];

    for (let i = 0; i < collisions.length; i += tilesPerRowOnMap) {
        collisionsMap.push(collisions.slice(i, i + tilesPerRowOnMap));
    }

    const boundaries = [];

    collisionsMap.forEach((row, i) => {
        row.forEach((symbol, j) => {
            if (symbol === searchSymbol) {
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * collisionWidthHeightScaled + offset.x,
                            y: i * collisionWidthHeightScaled + offset.y,
                        },
                        widthHeight: collisionWidthHeightScaled,
                    })
                );
            }
        });
    });

    return boundaries;
}

function createImage(path) {
    const image = new Image();
    image.src = path;
    return image;
}

function checkHorizontalCollision(rect1, boundary) {
    const boundaryCopied = {
        position: { x: boundary.position.x, y: boundary.position.y },
        width: boundary.width,
        height: boundary.height,
    };

    if (keys.a.pressed) {
        boundaryCopied.position.x += currentPlayerSpeed;
    }
    if (keys.d.pressed) {
        boundaryCopied.position.x -= currentPlayerSpeed;
    }

    if (
        isRectangularsColliding({
            rectangle1: rect1,
            rectangle2: boundaryCopied,
        })
    ) {
        return true;
    }
    return false;
}

function checkVerticalCollision(rect1, boundary) {
    const boundaryCopied = {
        position: { x: boundary.position.x, y: boundary.position.y },
        width: boundary.width,
        height: boundary.height,
    };

    if (keys.w.pressed) {
        boundaryCopied.position.y += currentPlayerSpeed;
    }
    if (keys.s.pressed) {
        boundaryCopied.position.y -= currentPlayerSpeed;
    }

    if (
        isRectangularsColliding({
            rectangle1: rect1,
            rectangle2: boundaryCopied,
        })
    ) {
        return true;
    }
    return false;
}

function drawImageAngled({
    image,
    mirroredImage,
    degree,
    originX,
    originY,
    x,
    frameVal,
    width,
    height,
    scale = 1,
}) {
    backgroundContext.save();

    backgroundContext.translate(originX, originY);

    backgroundContext.rotate((degree * Math.PI) / 180);

    if (degree > 90 || degree < -90) {
        // mirrored image the left half rotation
        backgroundContext.drawImage(
            mirroredImage,
            frameVal,
            0,
            width,
            height,
            x,
            0 - height / 2,
            width * scale,
            height * scale
        );
    } else {
        backgroundContext.drawImage(
            image,
            frameVal,
            0,
            width,
            height,
            x,
            0 - height / 2,
            width * scale,
            height * scale
        );
    }

    backgroundContext.restore();
}
