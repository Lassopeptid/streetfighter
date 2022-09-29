const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


const play = () => {
  let audio = document.querySelector("#audiofile");
  audio.volume = 0.1;
  audio.play();
}


const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const citizen = new Sprite({
  position: {
    x: 235,
    y: 240
  },
  imageSrc: './img/window.png',
  scale: 1.8,
  framesMax: 5,
  framesHold: 30
})


// const woman = new Fighter({
//   position: {
//     x: 0,
//     y: 0
//   },
//   velocity: {
//     x: 0,
//     y: 0
//   },
//   offset: {
//     x: 0,
//     y: 0
//   },
//   imageSrc: './img/woman-idle.png',
//   framesMax: 7,
//   scale: 3,
//   offset: {
//     x: 0,
//     y: 64
//   },
//   sprites: {
//     idle: {
//       imageSrc: './img/woman-idle.png',
//       framesMax: 7
//     },
//     run: {
//       imageSrc: './img/woman-walk.png',
//       framesMax: 6
//     }
//   }
// })


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
  imageSrc: './img/knight/idle.png',
  framesMax: 10,
  scale: 3,
  offset: {
    x: 0,
    y: 64
  },
  sprites: {
    idle: {
      imageSrc: './img/knight/idle.png',
      framesMax: 10
    },
    run: {
      imageSrc: './img/knight/run.png',
      framesMax: 10
    },
    jump: {
      imageSrc: './img/knight/jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './img/knight/fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './img/knight/attack.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/knight/hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/knight/death.png',
      framesMax: 10
    }
  },
  attackBox: {
    offset: {
      x: 10,
      y: 50
    },
    width: 160,
    height: 50
  }
})

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/knight2/idle.png',
  framesMax: 10,
  scale: 3,
  offset: {
    x: 0,
    y: 64
  },
  sprites: {
    idle: {
      imageSrc: './img/knight2/idle.png',
      framesMax: 10
    },
    run: {
      imageSrc: './img/knight2/run.png',
      framesMax: 10
    },
    jump: {
      imageSrc: './img/knight2/jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './img/knight2/fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './img/knight2/attack.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/knight2/hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/knight2/death.png',
      framesMax: 10
    }
  },
  attackBox: {
    offset: {
      x: -110,
      y: 50
    },
    width: 170,
    height: 50
  }
})

console.log(player)

const keys = {
  a: { pressed: false },
  d: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false }
}

const animate = () => {

  reqAnim = window.requestAnimationFrame(animate)
  // c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  citizen.update()
  // woman.update()
  // c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  // c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // detect for collision & enemy gets hit
  if (
    detectCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // this is where our player gets hit
  if (
    detectCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    console.log('index ok');
    getResult({ player, enemy, timerId });
  }


}


window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break;
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break;
      case 'w':
        player.velocity.y = -20
        break;
      case ' ':
        player.attack()
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break;
      case 'ArrowUp':
        enemy.velocity.y = -20
        break;
      case 'ArrowDown':
        enemy.attack()

        break;
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break;
    case 'a':
      keys.a.pressed = false
      break;
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break;
  }
})

countDown();
animate();
play();



// Genutzt wurde die gsap- library (auffindbar unter : https://cdnjs.com/libraries/gsap) für eine bessere Animation des Gesundheitsbalken.

// Die hier verwendeten Sprites stammen im Falle der Spieler-Sprites von: https://aamatniekss.itch.io/fantasy-knight-free-pixelart-animated-character
// Die restlichen Sprites sowie das Hintergrundbild von: https://ansimuz.itch.io/gothicvania-town
// Die Gesundheitsbalken-Sprites  von: https://www.seekpng.com/ipng/u2q8y3i1t4q8t4w7_health-bar-health-bar-sprite-2d/d