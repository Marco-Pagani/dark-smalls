const MOVES = ['ROCK', 'PAPER', 'SCISSORS']
const levels = [
  { attacks: 1, successMargin: 0.3 },
  { attacks: 1, successMargin: 0.3 },
  { attacks: 1, successMargin: 0.3 },
  { attacks: 2, successMargin: 0.25 },
  { attacks: 2, successMargin: 0.25 },
  { attacks: 2, successMargin: 0.25 },
  { attacks: 3, successMargin: 0.2 },
  { attacks: 3, successMargin: 0.15 },
  { attacks: 4, successMargin: 0.15 },
  { attacks: 5, successMargin: 0.1 },
]

let gameStatus = 1

const gameState = {
  level: 0,
  health: 3
}
const levelState = {

}
const roundState = {
  startTime: null,
  enemyAttacks: null,
  currentAttack: 0
}

const attackState = {
  startTime: null,
  chargeProgress: 0,
}

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent('game-wrapper')
}

function draw() {
  background(240)
  switch (gameStatus) {
    case 0: break
    case 1: updateLevelState(); break
    case 2: updateRoundState(); break
    case 3: updateAttackState(); break
  }
  drawDebug()
}

function updateLevelState() {
  if (mouseIsPressed) { // init round
    gameStatus = 2
    roundState.startTime = millis()
    roundState.enemyAttacks = new Array(levels[gameState.level]).fill(0).map(e => Math.floor(Math.random() * 3))
  }
}

function updateRoundState() {


  const time = millis() - roundState.startTime

  drawAttackTarget()

  if (time > 1000) drawAttackBar()

  if (roundState.currentAttack === roundState.enemyAttacks.length) return

  if (time > 2000) {
    gameStatus = 3
    attackState.startTime = millis()
  }
}

function updateAttackState() {
  drawAttackTarget()
  drawAttackBar()
  attackState.chargeProgress = (millis() - attackState.startTime) * 0.001
  if (keyIsPressed) handleAttackInput()
}

function handleAttackInput() {
  let chosenMove = -1
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) chosenMove = 0
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) chosenMove = 1
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) chosenMove = 2

  if (chosenMove >= 0) { // user made their move
    const success = chosenMove === roundState.enemyAttacks[roundState.currentAttack]
    console.log(success)
    gameStatus = 2
    roundState.currentAttack = roundState.currentAttack + 1
  }
}

function drawAttackTarget() {
  fill(0, 0, 0)
  text(MOVES[roundState.enemyAttacks[roundState.currentAttack]], 175, 175)
}

function drawAttackBar() {
  rectMode(CORNERS)
  strokeWeight(0)
  fill(180, 50, 50)
  rect(100, 100, 700, 150)
  const successZoneX = 700 - (levels[gameState.level].successMargin * 600)
  fill(50, 180, 50)
  rect(successZoneX, 100, 700, 150)
  strokeWeight(5)
  const linePos = 100 + attackState.chargeProgress * 600
  line(linePos, 100, linePos, 150)
}

function drawDebug() {
  text(JSON.stringify(gameState), 100, 600)
  text(JSON.stringify(levelState), 100, 620)
  text(JSON.stringify(roundState), 100, 640)
  text(JSON.stringify(attackState), 100, 660)
}
