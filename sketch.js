const levels = [
  { attacks: 1 },
  { attacks: 1 },
  { attacks: 1 },
  { attacks: 2 },
  { attacks: 2 },
  { attacks: 2 },
  { attacks: 3 },
  { attacks: 3 },
  { attacks: 4 },
  { attacks: 5 },
]

const gameRoundState = {
  attackStarted: false,
  enemyAttacks: [0],
  chargeProgress: 0
}

function setup() {
  const canvas = createCanvas(800, 800);
  canvas.parent('game-wrapper')
}
let sum = 0

function draw() {
  redraw()
  background(240);
  circle(500, 500, 50)
  text(sum, 10, 10)
  if (keyIsDown(87)) sum = sum + 1
  gameRoundState.attackStarted = keyIsDown(87)

}

