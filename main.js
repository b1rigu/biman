var canvas = document.querySelector("canvas");
canvas.width = 1660;
canvas.height = 930;
var ctx = canvas.getContext("2d");
var fps = 60;
var horizontalDirection = "";
var verticalDirection = "";
var msPrev = performance.now();
var msPerFrame = 1000 / fps;
var spriteImage = new Image();
spriteImage.src = "./assets/sprites.png";
var mapImage = new Image();
mapImage.src = "./assets/map.jpg";
mapImage.style.objectFit = "cover";
var MyMap = /** @class */ (function () {
    function MyMap() {
        this.position = {
            x: -2800,
            y: -1920,
        };
        this.width = 7000;
        this.height = 4800;
    }
    MyMap.prototype.draw = function () {
        ctx.drawImage(mapImage, this.position.x, this.position.y, this.width, this.height);
    };
    return MyMap;
}());
var Player = /** @class */ (function () {
    function Player() {
        this.position = {
            x: Math.floor(canvas.width / 2),
            y: Math.floor(canvas.height / 2),
        };
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = 50;
        this.height = 100;
        this.count = 0;
        this.frames = 0;
    }
    Player.prototype.draw = function () {
        var imageSelectY = 0;
        if (horizontalDirection === "right") {
            imageSelectY = 768;
        }
        else if (horizontalDirection === "left") {
            imageSelectY = 640;
        }
        else if (verticalDirection === "up") {
            imageSelectY = 896;
        }
        else if (verticalDirection === "down") {
            imageSelectY = 512;
        }
        ctx.drawImage(spriteImage, 64 * this.frames, imageSelectY, 64, 128, this.position.x, this.position.y, this.width, this.height);
    };
    Player.prototype.update = function () {
        this.count++;
        if (this.count > 3) {
            this.frames++;
            this.count = 0;
        }
        if (this.frames > 7)
            this.frames = 0;
        this.draw();
        if (this.position.x + this.velocity.x >= 0 &&
            this.position.x + this.width + this.velocity.x <= canvas.width) {
            this.position.x += this.velocity.x;
        }
        if (this.position.y + this.height + this.velocity.y <= canvas.height &&
            this.position.y + this.velocity.y >= 0) {
            this.position.y += this.velocity.y;
        }
    };
    return Player;
}());
var player = new Player();
var map = new MyMap();
function mainLoop() {
    requestAnimationFrame(mainLoop);
    // constantly run fps at desired value
    var msNow = performance.now();
    var msPassed = msNow - msPrev;
    if (msPassed < msPerFrame)
        return;
    var excessTime = msPassed % msPerFrame;
    msPrev = msNow - excessTime;
    // constantly run fps at desired value
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    map.draw();
    player.update();
    if (verticalDirection === "up") {
        map.position.y += 6;
        // player.velocity.y = -10;
    }
    else if (verticalDirection === "down") {
        map.position.y -= 6;
        // player.velocity.y = 10;
    }
    else {
        // player.velocity.y = 0;
    }
    if (horizontalDirection === "left") {
        // player.velocity.x = -10;
        map.position.x += 6;
    }
    else if (horizontalDirection === "right") {
        map.position.x -= 6;
        // player.velocity.x = 10;
    }
    else {
        // player.velocity.x = 0;
    }
}
mainLoop();
document.addEventListener("keydown", function (event) {
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
document.addEventListener("keyup", function (event) {
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
