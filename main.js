var canvas = document.querySelector("canvas");
var ctx = canvas === null || canvas === void 0 ? void 0 : canvas.getContext("2d");
var horizontalDirection = "";
var verticalDirection = "";
var Player = /** @class */ (function () {
    function Player() {
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
    Player.prototype.draw = function () {
        if (ctx) {
            ctx.fillStyle = "red";
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        }
    };
    Player.prototype.update = function () {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
    };
    return Player;
}());
var player = new Player();
function mainLoop() {
    if (canvas && ctx) {
        requestAnimationFrame(mainLoop);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        player.update();
        if (verticalDirection === "up") {
            player.velocity.y = -10;
        }
        else if (verticalDirection === "down") {
            player.velocity.y = 10;
        }
        else {
            player.velocity.y = 0;
        }
        if (horizontalDirection === "left") {
            player.velocity.x = -10;
        }
        else if (horizontalDirection === "right") {
            player.velocity.x = 10;
        }
        else {
            player.velocity.x = 0;
        }
    }
}
if (canvas) {
    canvas.width = 1664;
    canvas.height = 936;
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
