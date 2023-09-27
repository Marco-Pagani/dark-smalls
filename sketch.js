function preload() {
  font = loadFont('assets/OptimusPrinceps.ttf')
}

let enemySprites

function setup() {
  const canvas = createCanvas(800, 1000);
  canvas.parent('game-wrapper')

  enemySprites = new Array(10).fill(0).map((_, i) => loadImage(`assets/images/${i + 1}.png`))

  textFont(font)
  textSize(24)
}


const MOVES = ['SCISSORS', 'ROCK', 'PAPER']
const levels = [
  { attacks: 1, successMargin: 0.3, enemyName: 'AAAA, The Lesser' },
  { attacks: 1, successMargin: 0.3, enemyName: 'Macaroni of the Cupboard' },
  { attacks: 1, successMargin: 0.3, enemyName: 'Soothesayer Ibuprofen' },
  { attacks: 2, successMargin: 0.25, enemyName: 'The Lost Airpod' },
  { attacks: 2, successMargin: 0.25, enemyName: 'Havel the Pebble' },
  { attacks: 2, successMargin: 0.25, enemyName: 'Loathesome Ant' },
  { attacks: 3, successMargin: 0.2, enemyName: 'Beano The Everroasted' },
  { attacks: 3, successMargin: 0.15, enemyName: 'The Downtrodden Brick' },
  { attacks: 4, successMargin: 0.15, enemyName: 'Archworm Moe' },
  { attacks: 5, successMargin: 0.1, enemyName: 'The Coin Brothers' },
]

let globalState = 0
const gameState = { level: -1, health: 3 }
const levelState = { startTime: null }
const roundState = { startTime: null, enemyAttacks: null, currentAttack: 0 }
const attackState = { startTime: null, chargeProgress: 0, }

function draw() {
  background(210, 210, 210)
  switch (globalState) {
    case 0: updateGameState(); break
    case 1: updateLevelState(); break
    case 2: updateRoundState(); break
    case 3: updateAttackState(); break
    case 4: drawGameOver(); break
  }
  drawDebug()
}

function updateGameState() {
  text('click to start', 100, 100)
  if (mouseIsPressed) { // init round
    globalState = 1
    levelState.startTime = millis()
  }
}

function updateLevelState() {
  if (gameState.level === 9) {
    gameState = 4
    return
  }

  const time = millis() - levelState.startTime

  text(`Level ${gameState.level + 1}`, 100, 100)

  if (time > 2000) {
    image(enemySprites[gameState.level + 1], 100, 200)
    text(levels[gameState.level + 1].enemyName, 200, 200)
  }


  if (time > 4000) {
    globalState = 2
    gameState.level = gameState.level + 1
    roundState.startTime = millis()
    roundState.enemyAttacks = new Array(levels[gameState.level].attacks).fill(0).map(e => Math.floor(Math.random() * 3))
    roundState.currentAttack = 0
  }

}

function updateRoundState() {

  if (roundState.currentAttack === roundState.enemyAttacks.length) {
    globalState = 1
    levelState.startTime = millis()
    return
  }

  const time = millis() - roundState.startTime

  drawAttackTarget()

  if (time > 1000) drawAttackBar()



  if (time > 2000 || roundState.currentAttack > 0) {
    globalState = 3
    attackState.startTime = millis()
  }
}

function updateAttackState() {
  drawAttackTarget()
  drawAttackBar()
  attackState.chargeProgress = (millis() - attackState.startTime) * 0.001
  if (keyIsPressed && attackState.chargeProgress > 0.3) handleAttackInput()
  if (attackState.chargeProgress > 1) {
    gameState.health = gameState.health - 1
    if (gameState.health === 0) {
      globalState = 4
      return
    }
    globalState = 2
    roundState.currentAttack = roundState.currentAttack + 1
    attackState.chargeProgress = 0
  }
}

function handleAttackInput() {
  let chosenMove = -1
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) chosenMove = 0
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) chosenMove = 1
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) chosenMove = 2

  if (chosenMove >= 0) { // user made their move
    const successfulMove = chosenMove === roundState.enemyAttacks[roundState.currentAttack]
    const successfulTiming = attackState.chargeProgress < 1 && attackState.chargeProgress > (1 - levels[gameState.level].successMargin)
    if (!(successfulMove && successfulTiming)) {
      gameState.health = gameState.health - 1
      if (gameState.health === 0) {
        globalState = 4
        return
      }
    }
    globalState = 2
    roundState.currentAttack = roundState.currentAttack + 1
    attackState.chargeProgress = 0
  }
}

function drawAttackTarget() {
  fill(0, 0, 0)
  const moves = roundState.enemyAttacks.reduce((acc, atk) => acc + MOVES[atk] + ' ', '')
  text(moves, 175, 175)
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

function drawGameOver() {
  text(gameState.health ? 'win' : 'lose', 100, 100)
}

function drawDebug() {
  fill(0, 0, 0)
  text(JSON.stringify(gameState), 20, 900)
  text(JSON.stringify(levelState), 20, 920)
  text(JSON.stringify(roundState), 20, 940)
  text(JSON.stringify(attackState), 20, 960)
  text(globalState, 20, 980)
}
