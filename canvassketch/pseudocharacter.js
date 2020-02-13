const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();
var character = null;
var currentCharLoc = null;
var colors2 = ["#f3320b", "#fbec64", "#fe9469", "#530aca"];
var colors = ["#300a5c", "#f9a443", "#fed263", "#e0cbbc"];
var characterParams = {
  numStrokes: 10,
  sizeX: 400,
  sizeY: 400,
  xGrid: 3,
  yGrid: 3
};
var bgColor = colors[3];

const settings = {
  dimensions: [2048, 2048],
  p5: true,
  animate: true
};

const sketch = () => {
  setup();
  return ({ width, height }) => {
    draw();
  };
};

function setup() {
  // put setup code here
  background(bgColor);
  chaser = new Chaser(width / 2, height / 2);
  character = new Character(characterParams);
  currentCharLoc = createVector(
    characterParams.sizeX * 0.3,
    characterParams.sizeY * 0.3
  );
  // currentCharLoc = createVector(0, 0);
  smooth();
}

function draw() {
  // put drawing code here
  // background(255);
  // console.log(chaser);
  applyMatrix();
  translate(currentCharLoc.x, currentCharLoc.y);
  character.display();
  if (character.done) {
    // rect(
    //   -0.5 * characterParams.sizeX,
    //   -0.5 * characterParams.sizeY,
    //   2 * characterParams.sizeX,
    //   2 * characterParams.sizeY
    // );
    characterParams.numStrokes = Math.floor(random(10, 14));
    character = new Character(characterParams);
    currentCharLoc.x += characterParams.sizeX * 1.5;
    if (currentCharLoc.x + characterParams.sizeX * 0.5 > width) {
      currentCharLoc.x = characterParams.sizeX * 0.25;
      currentCharLoc.y += characterParams.sizeY * 1.3;
      if (currentCharLoc.y > height - characterParams.sizeY) {
        noLoop();
      }
    }
  }
  resetMatrix();
}

function keyPressed() {
  console.log(key);
  if (key == "R") {
    reset();
  }
  if (key == "S") {
    saveCanvas(new Date().getTime() + "pseudochars", "png");
  }
  if (key == "C") {
    reset();
  }
}
function reset() {
  background(bgColor);
  loop();
  character = new Character(characterParams);
  currentCharLoc = createVector(
    characterParams.sizeX * 0.3,
    characterParams.sizeY * 0.3
  );
}
class Character {
  constructor({ numStrokes, sizeX, sizeY, xGrid, yGrid }) {
    this.numStrokes = numStrokes;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.xGrid = xGrid; //int
    this.yGrid = yGrid; //int
    this.cellX = sizeX / xGrid;
    this.cellY = sizeY / yGrid;
    this.numCells = xGrid * yGrid;
    this.currentStroke = this.randomStroke();
    this.done = false;
  }

  //returns vector
  getGridCenterLoc(intLoc) {
    // integer index in grid
    return createVector(
      this.cellX / 2.0 + (intLoc % this.xGrid) * this.cellX,
      this.cellY / 2.0 + Math.floor(intLoc / this.xGrid) * this.cellY
    );
  }

  getUnitVectorFromInt(dir) {
    return createVector(-1 + (dir % 3), -1 + Math.floor(dir / 3));
  }

  randomStroke() {
    var target = new Target(
      this.getGridCenterLoc(Math.floor(random(this.numCells)))
    );
    var chaser = new Chaser(
      this.getGridCenterLoc(Math.floor(random(this.numCells))),
      this.getUnitVectorFromInt(Math.floor(random(9))).mult(8)
    );
    var duration = random(10, 60);
    this.numStrokes--;
    return new Stroke(chaser, target, duration);
  }

  display() {
    if (this.currentStroke.done()) {
      if (this.numStrokes !== 0) {
        this.currentStroke = this.randomStroke();
      } else {
        this.done = true;
      }
    } else {
      this.currentStroke.update();
      this.currentStroke.display();
    }
  }
}

class Stroke {
  constructor(chaser, target, duration) {
    this.chaser = chaser;
    this.target = target;
    this.duration = duration;
  }

  update() {
    this.chaser.seek(this.target.loc);
    this.chaser.update();
    this.duration--;
  }

  display() {
    this.chaser.display(this.duration);
  }

  doAll() {
    for (var i = 0; i < this.duration; i++) {
      this.chaser.seek(this.target.loc);
      this.chaser.update();
      this.chaser.display();
    }
    this.duration = 0;
  }

  done() {
    return this.duration < 0;
  }
}

function doStroke(chaser, target, duration) {
  for (var i = 0; i < duration; i++) {
    chaser.seek(target.loc);
    chaser.update();
    chaser.display();
  }
}

class Target {
  constructor(loc) {
    this.loc = loc;
    this.gravConst = 1.0;
    this.duration;
    fill(colors[0]);
    // ellipse(loc.x, loc.y, 10, 10);
  }
}

class Chaser {
  constructor(loc, vel) {
    this.loc = loc;
    this.pastLoc = null;
    this.pastStroke = 1;
    this.vel = vel;
    this.acc = createVector(0, 0);
    this.maxForce = 0.6;
    this.maxSpeed = 10.0;
  }

  update() {
    var { loc, vel, acc, maxSpeed, spacing, rotVel } = this;
    vel.add(acc);
    vel.limit(maxSpeed);
    loc.add(vel);
    acc.mult(0);
  }

  seek(target) {
    var { loc, vel, acc, maxSpeed, maxForce } = this;
    var desired = p5.Vector.sub(target, loc);
    var dist = desired.mag();
    desired.normalize();
    desired.mult(maxSpeed);
    var steer = p5.Vector.sub(desired, vel);
    steer.mult(dist * dist * 0.001);
    steer.limit(maxForce);
    acc.add(steer);
  }

  display(duration) {
    const { maxSpeed, loc, pastLoc, lastStroke, vel } = this;
    const xVelNormalized = map(vel.x, -maxSpeed, maxSpeed, 0, 1);
    stroke(lerpColor(color(colors[1]), color(colors[2]), xVelNormalized));
    let strokeSize = getStrokeWeight(vel.mag());
    if (duration < 20) strokeSize *= duration / 20;
    // strokeWeight(strokeSize);
    ellipseMode(CENTER);
    if (pastLoc) {
      lerpPointWithStroke(
        pastLoc,
        loc,
        lastStroke,
        strokeSize,
        20,
        diagonalLineNoiseStroke
      );
    }
    this.lastStroke = strokeSize;
    this.pastLoc = new createVector(this.loc.x, this.loc.y);
  }
}

const ellipseStroke = (loc, strokeSize) => {
  ellipse(loc.x, loc.y, strokeSize, strokeSize);
};

const rectStroke = (loc, strokeSize) => {
  rectMode(CENTER);
  rect(loc.x, loc.y, 1, strokeSize);
};
const diagonalLineStroke = (loc, strokeSize) => {
  line(
    loc.x + strokeSize,
    loc.y + strokeSize,
    loc.x - strokeSize,
    loc.y - strokeSize
  );
};
const diagonalLineNoiseStroke = (loc, strokeSize) => {
  line(
    loc.x + strokeSize,
    loc.y + strokeSize * noise(strokeSize),
    loc.x - strokeSize * noise(strokeSize),
    loc.y - strokeSize
  );
};

const noiseLineStroke = (loc, strokeSize) => {
  const xOffset = strokeSize * (-0.5 + noise(loc.x / 10.0));
  const yOffset = strokeSize * (-0.5 + noise(loc.y / 10.0));
  ellipse(loc.x + xOffset, loc.y + yOffset, strokeSize, strokeSize);
};
const lerpPointWithStroke = (
  startLoc,
  endLoc,
  startStroke,
  endStroke,
  numSteps,
  displayStroke
) => {
  const stepSize = 1.0 / numSteps;
  const incLoc = startLoc.copy();
  let incStroke = startStroke;
  for (let i = 0; i <= 1; i += stepSize) {
    incLoc.x = lerp(startLoc.x, endLoc.x, i);
    incLoc.y = lerp(startLoc.y, endLoc.y, i);
    incStroke = lerp(startStroke, endStroke, i);
    displayStroke(incLoc, incStroke);
  }
};
const getStrokeWeight = velMag => {
  return map(velMag * velMag, 0, 100, 90, 20);
};

canvasSketch(sketch, settings);
