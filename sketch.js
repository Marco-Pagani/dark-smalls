let music, hitSound, missSound, beatSound
function preload() {
  font = loadFont('assets/OptimusPrinceps.ttf')
  soundFormats('mp3')
  music = loadSound('assets/sounds/12ToccataAndFugueInDMinor.mp3')
  hitSound = loadSound('assets/sounds/hit.mp3')
  missSound = loadSound('assets/sounds/miss.mp3')
  beatSound = loadSound('assets/sounds/beat.mp3')
}

let enemySprites
let attackSprites = []
let controls

function keyPressed() {
  if (keyCode === UP_ARROW) return false
}

function setup() {
  const canvas = createCanvas(800, 1000);
  canvas.parent('game-wrapper')

  enemySprites = new Array(10).fill(0).map((_, i) => loadImage(`assets/images/${i + 1}.png`))

  controls = loadImage('assets/images/controls.png')

  attackSprites.push(loadImage('assets/images/scissors.png'))
  attackSprites.push(loadImage('assets/images/rock.png'))
  attackSprites.push(loadImage('assets/images/paper.png'))

  textFont(font)
  textAlign(CENTER);
  textSize(24)

}


const MOVES = ['SCISSORS', 'ROCK', 'PAPER']
const levels = [
  { attacks: 1, successMargin: 0.25, enemyName: 'AAAA, The Lesser' },
  { attacks: 1, successMargin: 0.23, enemyName: 'Macaroni of the Cupboard' },
  { attacks: 1, successMargin: 0.21, enemyName: 'Soothesayer Ibuprofen' },
  { attacks: 2, successMargin: 0.20, enemyName: 'The Lost Airpod' },
  { attacks: 2, successMargin: 0.19, enemyName: 'Havel the Pebble' },
  { attacks: 2, successMargin: 0.17, enemyName: 'Loathesome Ant' },
  { attacks: 3, successMargin: 0.15, enemyName: 'Beano The Everroasted' },
  { attacks: 3, successMargin: 0.12, enemyName: 'The Downtrodden Brick' },
  { attacks: 4, successMargin: 0.11, enemyName: 'Archworm Moe' },
  { attacks: 5, successMargin: 0.10, enemyName: 'The Coin Brothers' },
]

let globalState = 0
const gameState = { level: 0, health: 3 }
const levelState = { startTime: null }
const roundState = { startTime: null, enemyAttacks: null, currentAttack: 0 }
const attackState = { startTime: null, chargeProgress: 0, }

function draw() {
  background(210, 210, 210)
  image(controls, 400, 890)
  switch (globalState) {
    case 0: updateGameState(); break
    case 1: updateLevelState(); break
    case 2: updateRoundState(); break
    case 3: updateAttackState(); break
    case 4: drawGameOver(); break
  }
  // drawDebug()
}

function updateGameState() {
  textSize(72)
  fill(110, 20, 20)
  text('DARK SMALLS', 400, 150)
  textSize(28)
  fill(0, 0, 0)
  text('click to start', 400, 500)
  imageMode(CENTER)
  if (mouseIsPressed) { // init round
    music.play()
    globalState = 1
    levelState.startTime = millis()
  }
}

let beatTime
function updateLevelState() {
  text(`health: ${gameState.health}`, 100, 950)
  if (gameState.level === 10) {
    globalState = 4
    return
  }

  if (!beatTime || ((millis() - beatTime) > 1900)) {
    beatTime = millis()
    beatSound.play()
  }

  const time = millis() - levelState.startTime

  textSize(36)
  fill(110, 20, 20)
  text(`Level ${gameState.level + 1}`, 400, 100)
  if (time > 2000) {
    drawEnemy()
  }


  if (time > 4000) {
    globalState = 2
    roundState.startTime = millis()
    roundState.enemyAttacks = new Array(levels[gameState.level].attacks).fill(0).map(e => Math.floor(Math.random() * 3))
    roundState.currentAttack = 0
  }

}

function updateRoundState() {

  if (roundState.currentAttack === roundState.enemyAttacks.length) {
    globalState = 1
    gameState.level = gameState.level + 1
    levelState.startTime = millis()
    return
  }

  const time = millis() - roundState.startTime

  drawEnemy()
  if (gameState.level < 5) drawAttackTarget()
  else drawAttackBar()

  if (time > 1000) {
    if (gameState.level < 5) drawAttackBar()
    else drawAttackTarget()
  }


  if (time > 2000 || roundState.currentAttack > 0) {
    globalState = 3
    attackState.startTime = millis()
  }
}

function updateAttackState() {
  drawEnemy()
  drawAttackTarget()
  drawAttackBar()
  attackState.chargeProgress = (millis() - attackState.startTime) * 0.001
  if (keyIsPressed && attackState.chargeProgress > 0.3) handleAttackInput()
  else if (attackState.chargeProgress > 1) {
    missSound.play()
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
      missSound.play()
      gameState.health = gameState.health - 1
      if (gameState.health === 0) {
        globalState = 4
        return
      }
    }
    else hitSound.play()
    globalState = 2
    roundState.currentAttack = roundState.currentAttack + 1
    attackState.chargeProgress = 0
  }
}

function drawEnemy() {
  image(enemySprites[gameState.level], 400, 450, 500, 500)
  textSize(42)
  fill(110, 20, 20)
  text(levels[gameState.level].enemyName, 400, 750)
}

function drawAttackTarget() {
  strokeWeight(0)
  fill(240, 240, 240)
  //rect(100, 180, 700, 100)
  fill(180, 50, 50)
  textSize(20)
  text('parry this ->', 280, 140)
  roundState.enemyAttacks.forEach((atk, i) => {
    if (i < roundState.currentAttack || i > roundState.currentAttack + 1) return
    image(attackSprites[atk], 400 + (60 * (i - roundState.currentAttack)), 130, 40, 40)
  })
}

function drawAttackBar() {
  rectMode(CORNERS)
  strokeWeight(0)
  fill(180, 50, 50)
  rect(100, 50, 700, 100)
  const successZoneX = 700 - (levels[gameState.level].successMargin * 600)
  fill(50, 180, 50)
  rect(successZoneX, 50, 700, 100)
  strokeWeight(5)
  const linePos = 100 + attackState.chargeProgress * 600
  line(linePos, 50, linePos, 100)
}

function drawGameOver() {

  if (gameState.health > 1) fill(50, 180, 50)
  else fill(180, 50, 50)
  textSize(60)
  text((gameState.health > 1) ? 'lord of smallness felled' : 'YOU DIED', 400, 400)
}

function drawDebug() {
  textAlign(LEFT)
  textSize(18)
  fill(0, 0, 0)
  text(JSON.stringify(gameState), 20, 900)
  text(JSON.stringify(levelState), 20, 920)
  text(JSON.stringify(roundState), 20, 940)
  text(JSON.stringify(attackState), 20, 960)
  text(globalState, 20, 980)
  textAlign(CENTER)
}
