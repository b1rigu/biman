class Sprite {
    constructor({ position, image, scale = 1, frames = { max: 1 }, sprites }) {
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
    }

    draw() {
        c.drawImage(
            this.image,
            this.frames.val * this.image.width / this.frames.max,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.frames.max) * this.scale,
            this.image.height * this.scale
        );

        if (!this.moving || this.frames.max === 1) {
            this.frames.val = 0;
            return;
        }

        this.frames.elapsed++;
        if (this.frames.elapsed % 8 === 0) {
            this.frames.elapsed = 0;
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
}

class Boundary {
    constructor({ position, widthHeight }) {
        this.position = position;
        this.width = widthHeight;
        this.height = widthHeight;
    }

    draw() {
        c.fillStyle = "transparent";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
