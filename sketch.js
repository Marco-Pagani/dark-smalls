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

const gameState = {
  level: 0,
  health: 3
}
const levelState = {

}
const roundState = {
  attackStarted: false,
  startTime: null,
  enemyAttacks: [0],
  chargeProgress: 0,
  successMargin: 0.3
}

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent('game-wrapper')
}

function draw() {
  background(240)
  updateRoundState()
  drawAttackBar()
  drawDebug()
}

function updateRoundState() {
  if (roundState.attackStarted) {
    if (roundState.chargeProgress > 0.1 && keyIsDown(87)) roundState.attackStarted = false
    roundState.chargeProgress = (millis() - roundState.startTime) * 0.001
  }
  else if (keyIsDown(83)) {
    roundState.attackStarted = true
    roundState.startTime = millis()
    roundState.enemyAttacks = new Array(levels[gameState.level]).fill(0).map(e => Math.floor(Math.random() * 3))
  }

}

function drawAttackBar() {

  fill(0, 0, 0)
  text(MOVES[roundState.enemyAttacks[0]], 175, 175)
  rectMode(CORNERS)
  strokeWeight(0)
  fill(180, 50, 50)
  rect(100, 100, 700, 150)
  const successZoneX = 700 - (levels[gameState.level].successMargin * 600)
  fill(50, 180, 50)
  rect(successZoneX, 100, 700, 150)
  strokeWeight(5)
  const linePos = 100 + roundState.chargeProgress * 600
  line(linePos, 100, linePos, 150)
}

function drawDebug() {

  text(JSON.stringify(gameState), 100, 500)
  text(JSON.stringify(levelState), 100, 520)
  text(JSON.stringify(roundState), 100, 540)
}
