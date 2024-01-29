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

function getCanvas(width, height) {
    const canvas = document.querySelector("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
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
