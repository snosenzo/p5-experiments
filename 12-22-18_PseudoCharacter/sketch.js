var chaser = null;
function setup() {
  createCanvas(windowWidth, windowHeight);
  // put setup code here
  background(255);
  chaser = new Chaser(width / 2, height / 2);
  smooth();
}
function draw() {
  // put drawing code here
  // background(255);
  chaser.seek(createVector(mouseX, mouseY));
  // console.log(chaser);
  chaser.update();
  chaser.display();
}

function keyPressed() {
  console.log(key);
  if (key == "R") {
  }
  if (key == "S") {
    saveCanvas(new Date().getTime() + "cps", "png");
  }
  if (key == "C") {
    background(255);
  }
}

class Chaser {
  constructor(x, y) {
    this.loc = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxForce = 0.4;
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
    desired.normalize();
    desired.mult(maxSpeed);
    var steer = p5.Vector.sub(desired, vel);
    steer.limit(maxForce);
    acc.add(steer);
  }

  display() {
    stroke(0, 20);
    strokeWeight(0.3);
    ellipseMode(CENTER);
    fill(0);
    mouseIsPressed &&
      ellipse(
        this.loc.x,
        this.loc.y,
        this.vel.mag() * 5.0,
        this.vel.mag() * 5.0
        // (1 / (this.vel.mag() + 1)) * 25.0 + 7,
        // (1 / (this.vel.mag() + 1)) * 25.0 + 7
      );
  }
}
