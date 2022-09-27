class Sprite {
    // destructering für einfaches Ansprechen der Parameter.
    constructor({ position, imageSrc, scale = 1, frameMax = 1, framesCurrent = 0, framesElapsed  = 0, framesHold = 5 }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frameMax = frameMax
        this.framesCurrent = framesCurrent
        this.framesElapsed = framesElapsed
        this.framesHold = framesHold

    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x,
            this.position.y,
            (this.image.width / this.frameMax) * this.scale,
            this.image.height * this.scale
        )
    }
    update() {
        this.draw()
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0){
            if (this.framesCurrent < this.frameMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0            }
        }
    }

}