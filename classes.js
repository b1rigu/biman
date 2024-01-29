class Sprite {
    constructor({
        position,
        image,
        scale = 1,
        frames = { max: 1 },
        sprites,
        frameSpeed = defaultFrameSpeed,
    }) {
        this.position = position;
        this.image = image;
        this.scale = scale;

        if (scale === 0) {
            this.scale = 0.5;
        }

        this.frames = { ...frames, val: 0, elapsed: 0 };
        this.image.onload = () => {
            this.width = (this.image.width / this.frames.max) * this.scale;
            this.height = this.image.height * this.scale;
        };
        this.moving = false;
        this.sprites = sprites;
        this.frameSpeed = frameSpeed;
    }

    update() {
        this.draw();
        const canAddFrameResult = this.canAddFrame();
        if (canAddFrameResult === "add") this.frames.val++;
        else if (canAddFrameResult === "zero") this.frames.val = 0;
    }

    draw() {
        backgroundContext.drawImage(
            this.image,
            (this.frames.val * this.image.width) / this.frames.max,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.frames.max) * this.scale,
            this.image.height * this.scale
        );
    }

    canAddFrame() {
        if (!this.moving || this.frames.max === 1) {
            return "zero";
        }

        this.frames.elapsed++;
        if (this.frames.elapsed % this.frameSpeed === 0) {
            this.frames.elapsed = 0;
            if (this.frames.val < this.frames.max - 1) return "add";
            else return "zero";
        }
    }
}

class Player extends Sprite {
    update() {
        this.draw();
        const canAddFrameResult = this.canAddFrame();
        if (canAddFrameResult === "add") {
            if (this.frames.val % 2 === 0) audio.walk.play("main");
            this.frames.val++;
        } else if (canAddFrameResult === "zero") this.frames.val = 0;
    }
}

class Boundary {
    constructor({ position, widthHeight }) {
        this.position = position;
        this.width = widthHeight;
        this.height = widthHeight;
    }

    draw() {
        backgroundContext.fillStyle = "transparent";
        backgroundContext.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
