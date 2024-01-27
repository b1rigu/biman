class Sprite {
    constructor({ position, image, scale = 1, frames = { max: 1 }, sprites }) {
        this.position = position;
        this.image = image;
        this.scale = scale;
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
            this.frames.val * this.width,
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
        if (this.frames.elapsed % 10 === 0) {
            this.frames.elapsed = 0;
            if (this.frames.val < this.frames.max - 1) this.frames.val++;
            else this.frames.val = 0;
        }
    }
}

class Boundary {
    static width = 48;
    static height = 48;
    constructor({ position }) {
        this.position = position;
        this.width = 48;
        this.height = 48;
    }

    draw() {
        c.fillStyle = "transparent";
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
