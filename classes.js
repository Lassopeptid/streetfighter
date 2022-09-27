class Sprite {
    // destructering für einfaches Ansprechen der Parameter.
    constructor({
        position,
        imageSrc,
        scale = 1,
        frameMax = 1,
        offset = { x: 0, y: 0 }
    }) {
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.frameMax = frameMax
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.frameMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.frameMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }


    update() {
        this.draw()
        this.animateFrames()
    }

}

class Fighter extends Sprite {
    // destructering für einfaches Ansprechen der Parameter.
    constructor({
        position,
        velocity,
        color = 'red',
        offset,
        imageSrc,
        scale = 1,
        frameMax = 1,
        // offset = { x: 0, y: 0 },
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imageSrc,
            scale,
            frameMax,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastkey
        this.attackrange = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isattacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 5


    }

    update() {
        this.draw()
        this.attackrange.position.x = this.position.x + this.attackrange.offset.x
        this.attackrange.position.y = this.position.y
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //verhindert das Rausfallen aus der Leinwand.
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 64) {
            this.velocity.y = 0
        }
        else { this.velocity.y += falling }

    }
    attack() {
        this.isattacking = true;
        setTimeout(() => {
            this.isattacking = false
        }, 100)
    }
}