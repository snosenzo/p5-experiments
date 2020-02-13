const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
new p5();

const settings = {
  dimensions: [2048, 2048],
  p5: true,
  animate: true
};

const sketch = () => {
  setup();
  return ({ context, width, height }) => {
    draw();
  };
};

const noiseScale = 1000.0;
let particles = [];
const sqSize = 10;
const sqSpacing = 100;
const numParticles = 1000;
const circleRadius = 350;
var nz = 0;
let seed;

function setup() {
  background("#0440b4");
  fill("#FD6A5A");
  smooth();
  stroke("#FD6A5A");
  // for (let i = 0; i < numParticles; i++) {
  //   particles.push(new Particle(random(width), random(height)));
  // }
  particles.push(new Particle(width / 2, height));
}

function draw() {
  particles.forEach(p => {
    p.update();
    p.display();
  });
  nz += 0.5;
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.life = 500;
  }

  update() {
    var vel;
    vel = curlNoiseFloored(this.pos.x, this.pos.y);
    vel.y -= 0.8;
    vel.normalize();
    vel.mult(20);
    this.life -= 0.8;
    this.pos.add(vel);
  }

  display() {
    // if (dist(this.pos.x, this.pos.y, width / 2, height / 2) > circleRadius) {
    //   stroke(0, 70);
    // }

    strokeWeight(this.life / 8.0);
    point(this.pos.x, this.pos.y);
  }
}
function sqDirFromNoise(x, y) {
  var dirAngle = Math.floor(
    map(noise(x / noiseScale, y / noiseScale, nz), 0, 1, 0, 8)
  );
  dirAngle = dirAngle * (TWO_PI / 8) * 2 - TWO_PI;
  return dirAngle;
}
function dirFromNoise(x, y) {
  var dirAngle = map(
    noise(x / noiseScale, y / noiseScale, nz),
    0,
    1,
    -TWO_PI,
    TWO_PI
  );
  return dirAngle;
}
function curlNoise(x, y) {
  const eps = 1.0 / noiseScale;
  let n1, n2, a, b;
  x = x / noiseScale;
  y = y / noiseScale;
  n1 = noise(x, y + eps, nz);
  n2 = noise(x, y - eps, nz);
  a = (n1 - n2) / (2 * eps);

  n1 = noise(x + eps, y, nz);
  n2 = noise(x - eps, y, nz);

  b = (n1 - n2) / (2 * eps);

  var curl = createVector(a, -b);
  curl.normalize();
  return curl;
}

function curlNoiseFloored(x, y) {
  // curl operator
  const eps = 1.0 / noiseScale;
  noiseDetail(2, 0.5);
  let n1, n2, a, b;
  x = x / noiseScale;
  y = y / noiseScale;
  n1 = noise(x, y + eps, nz);
  n2 = noise(x, y - eps, nz);
  a = (n1 - n2) / (2 * eps);

  n1 = noise(x + eps, y, nz);
  n2 = noise(x - eps, y, nz);

  b = (n1 - n2) / (2 * eps);

  var curl = createVector(a, -b);

  var angle = curl.heading();
  // degrees of freedom
  var dof = 6;
  // floor the angle into one of the predetermined available angles
  var flooredangle = (TWO_PI / 3) * (floor((angle / PI) * dof) / float(dof));
  curl = p5.Vector.fromAngle(flooredangle);
  // curl.normalize();
  return curl;
}

const linesAlongDirStroke = (loc, dir, strokeSize) => {
  const numStrokes = strokeSize * 5;
  for (let i = 0; i < numStrokes; i++) {
    const centerOffset = createVector(
      random(strokeSize / 4),
      random(strokeSize / 4)
    );
    const rotOffset1 = random(Math.PI / 10.0);
    const rotOffset2 = random(Math.PI / 10.0);
    line(
      loc.x + centerOffset.x + strokeSize * cos(dir + rotOffset1),
      loc.y + centerOffset.y + strokeSize * sin(dir + rotOffset1),
      loc.x + centerOffset.x + strokeSize * cos(dir + rotOffset2 + PI),
      loc.y + centerOffset.y + strokeSize * sin(dir + rotOffset2 + PI)
    );
  }
};

canvasSketch(sketch, settings);
