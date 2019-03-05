var numPtsPerConnect = 20;
var numCps = 12;
let cps = [];
let cpt;
function setup() {
  createCanvas(windowWidth, windowHeight);
  // put setup code here
  background(255);
  cps.push(new ConnectPoint(width / 2, height / 2, random(TWO_PI)));
  initCPs();
  cpt = new CPTrail();
  smooth();
}

function connectCPs(cp1, cp2) {
  stroke(0, 15);
  cp1.pts.forEach((pt1, index) => {
    var pt2 = cp2.pts[index];
    line(pt1.x, pt1.y, pt2.x, pt2.y);
  });
}

function initCPs() {
  var cps = [];
  for (let i = 0; i < numCps; i++) {
    var cp = new ConnectPoint(
      random(100, width - 100),
      random(100, height - 100),
      random(TWO_PI)
    );
    cps.push(cp);
  }
  return cps;
}

function draw() {
  // put drawing code here
  // background(255);
  cpt.update();
  cpt.display();
}

function keyPressed() {
  console.log(key);
  if (key == "R") {
    cpt = new CPTrail();
  }
  if (key == "S") {
    saveCanvas(new Date().getTime() + "cps", "png");
  }
}
class CPTrail {
  constructor() {
    this.cps = initCPs();
    // this.cps.push(initCPs());
    this.target = this.newTarget();
    // this.maxLength = 10;
  }
  newTarget() {
    return createVector(random(100, width - 100), random(100, height - 100));
  }
  update() {
    var { cps } = this;
    this.steerTrails();
    if (p5.Vector.sub(cps[cps.length - 1].loc, this.target).mag() < 3) {
      this.target = this.newTarget();
    }
  }

  steerTrails() {
    var { cps, target } = this;
    for (let i = 0; i < cps.length; i++) {
      var cp = cps[i];
      if (i == cps.length - 1) {
        cp.seek(target);
      } else {
        cp.seek(cps[i + 1].loc);
        cp.rotTug(cps[i + 1]);
      }
      cp.update();
    }
  }

  display() {
    const { cps } = this;
    // cps.forEach(cp => {
    //   cp.display();
    // });
    for (let i = 1; i < cps.length; i++) {
      connectCPs(cps[i - 1], cps[i]);
    }
  }
}

class ConnectPoint {
  constructor(x, y, dir) {
    this.loc = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxForce = 0.2;
    this.maxSpeed = 5.0;
    this.dir = dir;
    this.spacing = Math.floor(random(2, 7));
    this.rotVel = random(0.005, 0.013);
    this.pts = this.getPtsAroundCenter(x, y, dir, this.spacing);
  }
  getPtsAroundCenter(x, y, dir, spacing) {
    var ptArray = [];
    ptArray.push(createVector(x, y));
    for (let i = 1; i < numPtsPerConnect; i++) {
      ptArray.push(
        createVector(
          x + Math.floor((i + 1) / 2) * spacing * cos(dir + PI * (-1 * i)),
          y + Math.floor((i + 1) / 2) * spacing * sin(dir + PI * (-1 * i))
        )
      );
    }
    return ptArray;
  }

  update() {
    var { loc, vel, acc, maxSpeed, spacing, rotVel } = this;
    vel.add(acc);
    vel.limit(maxSpeed);
    loc.add(vel);
    acc.mult(0);
    this.pts = this.getPtsAroundCenter(
      loc.x,
      loc.y,
      (this.dir += rotVel),
      spacing
    );
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

  rotTug(cp1) {
    var dirDiff = cp1.dir - this.dir;
    dirDiff = map(dirDiff, -TWO_PI, TWO_PI, -0.007, 0.007);
    // dirDiff *= 0.004;
    this.rotVel += dirDiff;
    this.rotVel = this.rotVel > 0.03 ? 0.03 : this.rotVel;
  }

  display() {
    stroke(0, 20);
    strokeWeight(0.3);
    noFill();
    ellipseMode(CENTER);
    this.pts.forEach(pt => {
      ellipse(pt.x, pt.y, 4, 4);
    });
  }
}
