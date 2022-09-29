const detectCollision = ({ rectangle1, rectangle2 }) => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
    rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
    rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
    rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

const playWinner = () => {

  let audio = document.querySelector("#audiofile");
  audio.pause()

  let audiowin = document.querySelector("#audiowin");
  audiowin.volume = 0.1;
  audiowin.play();

  console.log('utils-winner ok');
}

const playTie = () => {

  let audio = document.querySelector("#audiofile");
  audio.pause()

  let audiowin = new Audio('/music/lose.ogg')
  audiowin.volume = 0.1;
  audiowin.play();


  console.log('utils-tie ok');
}

const cancelAni = () => {
  setTimeout(() => { window.cancelAnimationFrame(reqAnim); }, 300);
}

const getResult = ({ player, enemy, timerId }) => {
  clearTimeout(timerId);
  cancelAni();
  document.querySelector('#displayText').style.display = 'flex';
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie';
    playTie();
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    playWinner();
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    playWinner();
  }
}

let timer = 10;
let timerId;
const countDown = () => {
  if (timer > 0) {
    timerId = setTimeout(countDown, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {
    getResult({ player, enemy, timerId })
  }
}
