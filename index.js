const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

//beschreibt das Fallen des Spielers nach dem Sprung.
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

c.fillRect(0,0, canvas.width, canvas.height)

const falling = 0.7
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: 'images/background.png'
})

// Player A wird im canvas positioniert.
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: "images/knight/idle.png",
    frameMax: 10,
    scale: 1,
    offset: {
      x: 215,
      y: 157
    },
})


// Player B wird im canvas positioniert.
const enemy = new Fighter({
    position: {
        x: 974,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: 'images/knight/idle.png',
    framesMax: 10,
    scale: 2.5,
    offset: {
      x: 500,
      y: 167
    },
})


const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false }
}

const collideDetector = ({ player, enemy }) => {
    return (
        player.attackrange.position.x + player.attackrange.width >= enemy.position.x &&
        player.attackrange.position.x <= enemy.position.x + enemy.width &&
        player.attackrange.position.y + player.attackrange.height >= enemy.position.y &&
        player.attackrange.position.y <= enemy.position.y + enemy.height
    )
}

const getResult = ({ player, enemy, timerID }) => {
    clearTimeout(timerID);
    let gameResult = document.querySelector('#gameResult');
    gameResult.style.display = "flex";
    if (player.health === enemy.health) {
        gameResult.innerHTML = 'Unentschieden.';
    } else if (player.health > enemy.health) {
        gameResult.innerHTML = 'Player A wins!';
    } else if (player.health < enemy.health) {
        gameResult.innerHTML = 'Player B wins!';
    }
}

let timer = 10;
let timerID;
let countdown = document.querySelector('#countdown')
const countDown = () => {
    if (timer > 0) {
        timerID = setTimeout(countDown, 1000)
        timer--
        countdown.innerHTML = timer
    }

    if (timer == 0) {
        getResult({ player, enemy, timerID })
    }
}



countDown();

animate = () => {
    window.requestAnimationFrame(animate)
    // c.fillStyle = "whitesmoke"
    // c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()

    player.update()
    enemy.update()

    // Player A Bewegunskontrolle.
    player.velocity.x = 0
    if (keys.a.pressed && player.lastkey === "a") { player.velocity.x = -3 }
    else if (keys.d.pressed && player.lastkey === "d") { player.velocity.x = 3 }

    // Player B Bewegunskontrolle.
    enemy.velocity.x = 0
    if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") { enemy.velocity.x = -3 }
    else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") { enemy.velocity.x = 3 }

    const enemyHP = document.querySelector('#enemyHealth');
    const playerHP = document.querySelector('#playerHealth');
    // Kollisionsverhalten Player A.
    if (
        collideDetector({
            player, enemy
        }) &&
        player.isattacking
    ) {
        console.log('player attack');
        player.isattacking = false;
        enemy.health -= 20;
        enemyHP.style.width = enemy.health + "%";
    }


    // Kollisionsverhalten Player B.
    if (
        collideDetector({
            enemy, player
        }) &&
        enemy.isattacking
    ) {
        console.log('enemy attack');
        enemy.isattacking = false;
        player.health -= 20;
        playerHP.style.width = player.health + "%";
    }

    //
    if (enemy.health <= 0 || player.health <= 0) {
        getResult({ player, enemy, timerID });
    }

}
animate()

window.addEventListener("keydown", (evt) => {
    // Player A Steuerung.
    switch (evt.key) {
        case "d":
            keys.d.pressed = true
            player.lastkey = "d"
            break;
        case "a":
            keys.a.pressed = true
            player.lastkey = "a"
            break;
        case "w":
            player.velocity.y = -20
            break;
        case " ":
            player.attack()
            break;
    }

    // Player B Steuerung.
    switch (evt.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = true
            enemy.lastkey = "ArrowRight"
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true
            enemy.lastkey = "ArrowLeft"
            break;
        case "ArrowUp":
            enemy.velocity.y = -20
            break;
        case "ArrowDown":
            enemy.attack()
            break;
    }

})

window.addEventListener("keyup", (evt) => {
    // Player A Steuerung.
    switch (evt.key) {
        case "d":
            keys.d.pressed = false
            break;
        case "a":
            keys.a.pressed = false
            break;

    }

    // Player B Steuerung.
    switch (evt.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break;

    }

})

