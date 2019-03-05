var character = null;
var currentCharLoc = null;
var characterParams = {
  numStrokes: 5,
  sizeX: 100,
  sizeY: 100,
  xGrid: 3,
  yGrid: 3
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  // put setup code here
  background(255);
  chaser = new Chaser(width / 2, height / 2);
  character = new Character(characterParams);
  currentCharLoc = createVector(characterParams.sizeX, characterParams.sizeY);
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
    rect(
      -0.5 * characterParams.sizeX,
      -0.5 * characterParams.sizeY,
      2 * characterParams.sizeX,
      2 * characterParams.sizeY
    );
    characterParams.numStrokes = Math.floor(random(3, 6));
    character = new Character(characterParams);
    currentCharLoc.x += characterParams.sizeX * 2;
    if (currentCharLoc.x > width) {
      currentCharLoc.x = 100;
      currentCharLoc.y += characterParams.sizeY * 2;
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
  background(255);
  character = new Character(characterParams);
  currentCharLoc = createVector(characterParams.sizeX, characterParams.sizeY);
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
    fill(255, 0, 0, 100);
    // ellipse(loc.x, loc.y, 10, 10);
  }
}

class Chaser {
  constructor(loc, vel) {
    this.loc = loc;
    this.pastLoc = null;
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
    stroke(0);
    let strokeSize = getStrokeWeight(this.vel.mag());
    if (duration < 20) strokeSize *= duration / 20;
    strokeWeight(strokeSize);
    ellipseMode(CENTER);
    // fill(0);
    if (this.pastLoc !== null) {
      line(this.pastLoc.x, this.pastLoc.y, this.loc.x, this.loc.y);
    }
    this.pastLoc = new p5.Vector(this.loc.x, this.loc.y);

    // ellipse(
    //   this.loc.x,
    //   this.loc.y,
    //   5,
    //   5
    //   // this.vel.mag() * 5.0,
    //   // this.vel.mag() * 5.0
    //   // (1 / (this.vel.mag() + 1)) * 25.0 + 7,
    //   // (1 / (this.vel.mag() + 1)) * 25.0 + 7
    // );
  }
}

const lerpPointWithStroke = (startLoc, endLoc, startStroke, endStroke) {
  
}
const getStrokeWeight = velMag => {
  return map(velMag * velMag, 1, 100, 15, 3);
};
