const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
let noise;
let map;
import { bloomFrag, blurFrag, baseVert } from "./utils/shaders";
// new p5();
const cWidth = 1024;
const cHeight = 1024;
const settings = {
  dimensions: [cWidth, cHeight],
  p5: { p5, preload },
  animate: true,
  scaleToFit: true,
  duration: 5
};

let seed;
var lights = [];
var droplets = [];
let pass1, pass2, bloomPass, orig;
let blurH, blurV, bloom;
const sketch = ({ p5 }) => {
  setup(p5, cWidth, cHeight);
  window.addEventListener("keypress", e => {
    console.log(e);
    if (e.key === "a") {
      addRandomLight();
    }
    if (e.key === "r") {
      setup(p5, cWidth, cHeight);
    }
  });
  return ({ p5, width, height, time, playhead }) => {
    draw(p5, width, height, time, playhead);
  };
};
function preload(p5) {
  noise = p5.noise;
  map = p5.map;
  blurH = p5.loadShader("./shaders/base.vert", "./shaders/blur.frag");
  blurV = p5.loadShader("./shaders/base.vert", "./shaders/blur.frag");
  bloom = p5.loadShader("./shaders/base.vert", "./shaders/bloom.frag");
}
function setup(p5, width, height) {
  orig = p5.createGraphics(width, height);
  pass1 = p5.createGraphics(width, height, p5.WEBGL);
  pass2 = p5.createGraphics(width, height, p5.WEBGL);
  bloomPass = p5.createGraphics(width, height, p5.WEBGL);
  // orig.strokeCap(SQUARE);
  for (var i = 0; i < 10; i++) {
    addNoiseLineLight();
  }
  lights = lights.sort((a, b) => a.depth < b.depth);
  pass1.noStroke();
  pass2.noStroke();
  bloomPass.noStroke();
  // pass1.noFill();
  // pass2.noFill();
  // bloomPass.noFill();
}

function draw(p5, width, height, time, playhead) {
  orig.background(50);
  lights.forEach(light => {
    light.display(orig, playhead);
  });
  rain(orig, 300);
  droplets = droplets.filter(drop => {
    drop.update();
    drop.display(orig);
    return !drop.isDead();
  });
  pass1.shader(blurH);
  blurH.setUniform("tex0", orig);
  blurH.setUniform("texelSize", [1.0 / width, 1.0 / height]);
  blurH.setUniform("direction", [0.0, 1.0]);
  pass1.rect(0, 0, width, height);

  pass2.shader(blurV);
  blurV.setUniform("tex0", pass1);
  blurV.setUniform("texelSize", [1.0 / width, 1.0 / height]);
  blurV.setUniform("direction", [0.0, 1.0]);

  pass2.rect(0, 0, width, height);
  bloomPass.shader(bloom);
  bloom.setUniform("tex0", orig);
  bloom.setUniform("tex1", pass2);

  bloom.setUniform("mouseX", 0.5 + 0.8 * p5.noise(time * 5));
  bloomPass.rect(0, 0, width, height);
  p5.image(bloomPass, 0, 0, width, height);
  // if (frameCount % 20) addLight();
}
function rain(graphics, amt) {
  graphics.stroke(100);
  graphics.strokeWeight(1);
  for (let i = 0; i < amt; i++) {
    const pos = new p5.Vector(Math.random() * cWidth, Math.random() * cHeight);
    graphics.line(pos.x, pos.y, pos.x, pos.y + Math.random() * 20);
  }
}

function addRandomLight() {
  // var vec1 = randomPointInCircle().add(new p5.Vector(0, 0));
  // var vec2 = randomPointInCircle().add(new p5.Vector(0, 0));
  // var vec1 = randomPointInCircle().add(new p5.Vector(cWidth / 2, cHeight / 2));
  // var vec2 = randomPointInCircle().add(new p5.Vector(cWidth / 2, cHeight / 2));
  var vec1 = randomPointInBox().add(new p5.Vector(0, cHeight / 4));
  var vec2 = randomPointInBox().add(new p5.Vector(0, cHeight / 4));
  var l = new Light(vec1, vec2);
  lights.push(l);
}
function checkXInBounds(x) {
  return x > 0 && x < cWidth;
}
function addNoiseLineLight() {
  const { vec1, vec2 } = randomPointsOnNoiseLineApart(
    Math.random() * cWidth,
    Math.random() * 100,
    cHeight,
    0
  );
  lights.push(new Light(vec1, vec2));
}
function randomPointsOnNoiseLineApart(startX, ny, amp, yOffset) {
  const vec1 = new p5.Vector(
    startX,
    map(noise(startX, ny), 0, 1, yOffset, yOffset + amp)
  );
  let randomLength = (Math.random() * cWidth) / 4 + cWidth / 9;
  if (!checkXInBounds(vec1.x + randomLength)) randomLength *= -1;
  const vec2 = new p5.Vector(
    startX + randomLength,
    map(noise(startX + randomLength, ny), 0, 1, yOffset, yOffset + amp)
  );
  return { vec1, vec2 };
}
function randomPointInCircle() {
  const angle = Math.random() * (8 * Math.PI);
  const radius = Math.random() * (cWidth / 3);
  return new p5.Vector(Math.cos(angle) * radius, Math.sin(angle) * radius);
}
function randomPointInBox() {
  const x = Math.random() * (cWidth / 2) + cWidth / 4;
  const y = (Math.random() * cHeight) / 2;
  return new p5.Vector(x, y);
}
function getPointAndAngle() {}

class Light {
  constructor(vec1, vec2) {
    this.pos1 = vec1;
    this.pos2 = vec2;
    this.depth = Math.random(); // larger number closer
    this.length = p5.Vector.sub(vec1, vec2).mag();
    this.lowerPointIsPos1 = vec1.y > vec2.y;
    this.thetaOffset = Math.random() * 1000000;
    this.swayAmp = Math.random() * 10;
  }

  display(graphics, playhead) {
    const swayPos1 = graphics.createVector(
      this.pos1.x +
        this.swayAmp * Math.sin(playhead * Math.PI * 2 + this.thetaOffset),
      this.pos1.y
    );

    const swayPos2 = graphics.createVector(
      this.pos2.x +
        this.swayAmp * Math.sin(playhead * Math.PI * 2 + this.thetaOffset),
      this.pos2.y
    );
    if (Math.random() > 0.99) {
      const lowerPoint = this.lowerPointIsPos1 ? swayPos1 : swayPos2;
      droplets.push(new Droplet(lowerPoint.x, lowerPoint.y, this.depth));
    }
    graphics.stroke(0, 0.75 * 255);
    graphics.strokeWeight(this.depth * 2);
    graphics.strokeCap(graphics.SQUARE);
    graphics.line(swayPos1.x, swayPos1.y, this.pos1.x, 0);
    graphics.line(swayPos2.x, swayPos2.y, this.pos2.x, 0);
    graphics.stroke(0, 50 * this.depth * 205);
    const lightThickness = this.depth * 5;
    graphics.strokeWeight(lightThickness);
    graphics.line(
      swayPos1.x,
      swayPos1.y - lightThickness * 0.85,
      swayPos2.x,
      swayPos2.y - lightThickness * 0.85
    );
    graphics.stroke(255, 232, 150);
    graphics.line(swayPos1.x, swayPos1.y, swayPos2.x, swayPos2.y);
  }
}
const gravity = 0.1;
class Droplet {
  constructor(x, y, depth) {
    this.pos = new p5.Vector(x, y);
    this.vel = new p5.Vector(0, 0);
    this.acc = new p5.Vector(0, gravity);
    this.depth = depth;
  }
  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }
  isDead() {
    return this.pos.y > cHeight;
  }
  display(graphics) {
    graphics.strokeWeight(this.depth * 2);
    graphics.stroke(255, 232, 150);
    graphics.point(this.pos.x, this.pos.y);
  }
}

canvasSketch(sketch, settings);
