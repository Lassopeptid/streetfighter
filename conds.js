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