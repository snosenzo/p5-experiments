const canvasSketch = require("canvas-sketch");
const p5 = require("p5");
const isec = require("@thi.ng/geom-isec");
const { pathsToSVG } = require("canvas-sketch-util/penplot");
const { centroid: centroidFunc } = require("@thi.ng/geom-poly-utils");
const vec = require("@thi.ng/vectors");
const {
  gridCallback,
  sqGridPaddingCallback
} = require("../utils/formatting-callbacks.js");

let Vector = null;
const preload = p => {
  // You can use p5.loadImage() here, etc...

  Vector = p5.Vector;
};
const sin = Math.sin;
const cos = Math.cos;
let polylines = [];

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  pixelsPerInch: 300,
  // Turn on a render loop
  dimensions: "Letter",
  bleed: 25,
  animate: false
};
let width = 0;
let height = 0;
let boxes = [];

canvasSketch(({ p5, width: w, height: h }) => {
  // Return a renderer, which is like p5.js 'draw' function
  width = w;
  height = h;
  setup(p5);
  return ({ p5, time }) => {
    // Draw with p5.js things
    polylines = [];
    draw(p5);
    return [
      p5.canvas,
      {
        data: pathsToSVG(polylines, {
          width,
          height,
          units: "px"
        }),
        extension: ".svg"
      }
    ];
  };
}, settings);

const bounds = ptArray => {
  const min = {
    x: Number.MAX_SAFE_INTEGER,
    y: Number.MAX_SAFE_INTEGER
  };
  const max = {
    x: -1 * Number.MAX_SAFE_INTEGER,
    y: -1 * Number.MAX_SAFE_INTEGER
  };
  ptArray.forEach(pt => {
    if (pt[0] < min.x) min.x = pt[0];
    if (pt[0] > max.x) max.x = pt[0];
    if (pt[1] < min.y) min.y = pt[1];
    if (pt[1] > max.y) max.y = pt[1];
  });
  return {
    min,
    max
  };
};

function random(...args) {
  let lower, upper;
  if (args.length >= 2) {
    lower = args[0];
    upper = args[1];
  } else if (args.length === 0) {
    lower = 0;
    upper = args[0];
  } else {
    lower = 0;
    upper = 1;
  }
  return lower + (upper - lower) * Math.random();
}

function randomVectorInBoxWithMargin(x, y, width, height, marginX, marginY) {
  return [
    random(x + marginX, x + marginX + width),
    random(y + marginY, y + marginY + height)
  ];
}

const numBoxes = 1;

function setup(p5) {
  p5.background(255);
  let z = 0;
  for (let i = 0; i < numBoxes; i++) {
    boxes.push(
      getRibbonShape(
        Math.PI * 5 * p5.noise((i / width) * 1.5, (i + 10 / width) * 1.5),
        2.2, //+ 8 * p5.noise((i / width) * 1.5, (i / width) * 1.5),
        p5
      )
    );
    z += 0.05;
  }
}
function draw(p5) {
  boxes.forEach(box => {
    box.draw(p5);
    polylines.push(box.getFillLines(box.lineFillSpacing, box.angle, p5));
  });
}

function drawShapeOutline(p5, shape) {
  p5.fill(0, 255, 0);
  p5.beginShape(p5.FILL);
  shape.forEach(pt => {
    p5.vertex(pt[0], pt[1]);
  });
  p5.endShape();
}

function drawShapeFillLines(p5, lines) {
  p5.strokeWeight(1);
  lines.forEach(ln => {
    if (ln[0] && ln[1]) p5.line(ln[0][0], ln[0][1], ln[1][0], ln[1][1]);
    else console.log(ln);
  });
}
class Shape {
  constructor(customPath, angle = 0, spacing = 10) {
    this.path = customPath;
    this.centroid = this.calcCentroid();
    this.angle = angle;
    this.lineFillSpacing = spacing;
  }

  calcCentroid() {
    let centroid = [];
    if (this.path[0] === this.path[this.path.length - 1]) {
      centroid = centroidFunc(this.path.slice(0, -1));
    } else {
      centroid = centroidFunc(this.path);
    }
    return centroid;
  }

  updatePath(newPath) {
    this.path = [...newPath];
    this.centroid = this.calcCentroid();
  }

  getTransformedShape(angle) {
    return this.path.map(pt => {
      let finPt = [];
      vec.sub(finPt, pt, this.centroid);
      vec.rotate(finPt, finPt, angle);
      return finPt;
    });
  }
  getRevertedLines(lines, angle, rotCenter) {
    return lines.map(pts => {
      return pts.map(pt => {
        let finPt = [0, 0];
        vec.rotate(finPt, pt, -angle);
        vec.add(finPt, this.centroid, finPt);
        return finPt;
      });
    });
  }
  getFillLines(spacing = 12, angle = 0, p5) {
    const lines = [];
    const transformedShape = this.getTransformedShape(angle);
    const shapeBounds = bounds(transformedShape);
    let dir = [1, 0];
    let rpos = [shapeBounds.min.x, shapeBounds.min.y];
    for (let i = rpos[1]; i < shapeBounds.max.y + spacing; i += spacing) {
      const intersection = isec.intersectRayPolylineAll(
        rpos,
        dir,
        transformedShape,
        true
      );
      if (!intersection.isec) continue;
      // for (let j = 0; j < intersection.isec.length; j += 2) {
      // console.log(intersection.isec);
      lines.push(intersection.isec.slice(0, 2));
      // }
      rpos[1] = i;
    }
    // drawShapeOutline(p5, transformedShape);
    // drawShapeFillLines(p5, lines);
    return this.getRevertedLines(lines, angle);
  }

  drawOutline(p5) {
    p5.stroke(0);
    p5.strokeWeight(0.5);
    drawShapeOutline(p5, this.path);
  }

  drawFill(p5) {
    const lines = this.getFillLines(this.lineFillSpacing, this.angle, p5);
    p5.strokeWeight(1);
    drawShapeFillLines(p5, lines);
  }

  draw(p5) {
    // this.drawOutline(p5);
    this.drawFill(p5);
  }
}

function getRibbonShape(angle, lineFillSpacing, p5) {
  const cpt = new CPTrail(p5);
  const path = [];
  for (let i = 0; i < 600; i++) {
    console.log(i);
    cpt.update();
  }
  // cpt.display(p5);
  path.push(...cpt.getOutline());
  path.push(path[0]);
  return new Shape(path, angle, lineFillSpacing);
}

var numPtsPerConnect = 3;
var numCps = 70;
let cpt;

function connectCPs(cp1, cp2, p5) {
  p5.stroke(0);
  p5.strokeWeight(2);
  cp1.pts.forEach((pt1, index) => {
    var pt2 = cp2.pts[index];
    p5.line(pt1.x, pt1.y, pt2.x, pt2.y);
  });
}
function getOuterMostConnections(cp1, cp2) {
  return [
    [
      [cp1.pts[0].x, cp1.pts[0].y],
      [cp2.pts[0].x, cp2.pts[0].y]
    ],
    [
      [cp1.pts[cp1.pts.length - 1].x, cp1.pts[cp1.pts.length - 1].y],
      [cp2.pts[cp2.pts.length - 1].x, cp2.pts[cp2.pts.length - 1].y]
    ]
  ];
}
function getOutsidePoints(cp1) {
  return [
    [cp1.pts[0].x, cp1.pts[0].y],
    [cp1.pts[cp1.pts.length - 1].x, cp1.pts[cp1.pts.length - 1].y]
  ];
}
function initCPs(p5) {
  var cps = [];
  for (let i = 0; i < numCps; i++) {
    var cp = new ConnectPoint(
      p5.random(100, width - 100),
      p5.random(100, height - 100),
      0,
      p5
    );
    cps.push(cp);
  }
  return cps;
}

class CPTrail {
  constructor(p5) {
    this.p5 = p5;
    this.cps = initCPs(p5);
    // this.cps.push(initCPs());
    this.target = this.newTarget();
    // this.maxLength = 10;
  }
  newTarget() {
    return this.p5.createVector(
      this.p5.random(100, width - 100),
      this.p5.random(100, height - 100)
    );
  }
  update() {
    var { cps } = this;
    this.steerTrails();
    // if (p5.Vector.sub(cps[cps.length - 1].loc, this.target).mag() < 3) {
    //   this.target = this.newTarget();
    // }
    this.target.x = width / 2;
    this.target.y = height / 2;
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
  getOutline() {
    const { cps } = this;
    const side1Path = [];
    const side2Path = [];
    for (let i = 0; i < cps.length; i++) {
      const [side1Point, side2Point] = getOutsidePoints(cps[i]);
      side1Path.push(side1Point);
      side2Path.push(side2Point);
    }
    side2Path.reverse();
    const allLines = [...side1Path, ...side2Path];
    console.log(allLines);
    return allLines;
  }

  display(p5) {
    const { cps } = this;
    // cps.forEach(cp => {
    //   cp.display();
    // });
    for (let i = 1; i < cps.length; i++) {
      connectCPs(cps[i - 1], cps[i], p5);
    }
  }
}

class ConnectPoint {
  constructor(x, y, dir, p5) {
    this.p5 = p5;
    this.loc = p5.createVector(x, y);
    this.vel = p5.createVector(0, 0);
    this.acc = p5.createVector(0, 0);
    this.maxForce = 0.2;
    this.maxSpeed = 5.0;
    this.dir = dir;
    this.spacing = 80; //Math.floor(random(1, 4));
    this.rotVel = p5.random(0.005, 0.013);
    this.pts = this.getPtsAroundCenter(x, y, dir, this.spacing);
  }
  getPtsAroundCenter(x, y, dir, spacing) {
    var ptArray = [];
    ptArray.push(this.p5.createVector(x, y));
    for (let i = 1; i < numPtsPerConnect; i++) {
      ptArray.push(
        this.p5.createVector(
          x + Math.floor((i + 1) / 2) * spacing * cos(dir + Math.PI * (-1 * i)),
          y + Math.floor((i + 1) / 2) * spacing * sin(dir + Math.PI * (-1 * i))
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
    var { loc, vel, acc, maxSpeed, maxForce, p5 } = this;
    var desired = Vector.sub(target, loc);
    desired.normalize();
    desired.mult(maxSpeed);
    var steer = Vector.sub(desired, vel);
    steer.limit(maxForce);
    acc.add(steer);
  }

  rotTug(cp1) {
    var dirDiff = cp1.dir - this.dir;
    dirDiff = this.p5.map(dirDiff, -Math.PI * 2, Math.PI * 2, -0.001, 0.001);
    // dirDiff *= 0.004;
    this.rotVel += dirDiff;
    this.rotVel = Math.abs(this.rotVel) > 0.01 ? 0.01 : this.rotVel;
  }

  display() {
    // stroke(0, 20);
    // strokeWeight(0.3);
    // noFill();
    // ellipseMode(CENTER);
    // this.pts.forEach(pt => {
    //   this.p5.ellipse(pt.x, pt.y, 4, 4);
    // });
  }
}
