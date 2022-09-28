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
}

// const audioStop = () => {

//   let audiowin = document.querySelector("#audiowin");
//   audiowin.pause();

// }

const getResult = ({ player, enemy, timerId }) => {
  // playWinner();
  clearTimeout(timerId);
  // audioStop();


  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'

  }

}

let timer = 60;
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
