class Sprite {
    constructor({
        position,
        image,
        scale = 1,
        frames = { max: 1 },
        sprites,
        frameSpeed = defaultFrameSpeed,
        extras = {},
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
        this.animating = false;
        this.sprites = sprites;
        this.frameSpeed = frameSpeed;
        this.extras = extras;
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
        if (!this.animating || this.frames.max === 1) {
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

class Gun extends Sprite {
    draw() {
        drawImageAngled({
            image: this.image,
            mirroredImage: this.sprites.mirrored,
            degree: this.extras.degree,
            originX: this.position.x,
            originY: this.position.y,
            x: 20,
            frameVal: (this.frames.val * this.image.width) / this.frames.max,
            width: this.image.width / this.frames.max,
            height: this.image.height,
            scale: this.scale,
        });
    }

    canAddFrame() {
        if (!this.animating || this.frames.max === 1) {
            return "zero";
        }

        this.frames.elapsed++;
        if (this.frames.elapsed % this.frameSpeed === 0) {
            this.frames.elapsed = 0;
            if (this.frames.val < this.frames.max - 1) return "add";
            else {
                this.animating = false;
                return "zero";
            }
        }
    }
}

class Bullet {
    constructor({ image, goingVelocity, degree }) {
        this.position = {
            x: backgroundCanvas.width / 2,
            y: backgroundCanvas.height / 2,
        };
        this.width = 16;
        this.height = 16;
        this.goingVelocity = goingVelocity;
        this.image = image;
        this.degree = degree;
    }

    draw() {
        drawImageAngled({
            image: this.image,
            mirroredImage: this.image,
            degree: this.degree,
            originX: this.position.x,
            originY: this.position.y,
            x: 0,
            frameVal: 0,
            width: this.image.width,
            height: this.image.height,
        });

        if (
            this.position.x + this.width >= 0 &&
            this.position.x <= 0 + backgroundCanvas.width &&
            this.position.y <= 0 + backgroundCanvas.height &&
            this.position.y + this.height >= 0
        ) {
            this.position.x -= this.goingVelocity.x;
            this.position.y -= this.goingVelocity.y;
        } else {
            bullets.splice(0, 1);
        }
    }
}

class Boundary {
    constructor({ position, widthHeight }) {
        this.position = position;
        this.width = widthHeight;
        this.height = widthHeight;
    }
}
