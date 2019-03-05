const numPtsPerConnect = 20;
const numCps = 12;
let cps = [];
function setup() {
  createCanvas(800, 800);
  // put setup code here
  background(255);
  initCPs();
  smooth();
}
function connectCPs(cp1, cp2) {
  stroke(0, 120);
  cp1.pts.forEach((pt1, index) => {
    const pt2 = cp2.pts[index];
    line(pt1.x, pt1.y, pt2.x, pt2.y);
  });
}

function initCPs() {
  cps = [];
  for (let i = 0; i < numCps; i++) {
    const cp = new ConnectPoint(
      random(100, width - 100),
      random(100, height - 100),
      random(TWO_PI)
    );
    cps.push(cp);
  }
}

function intersect(A, B, C, D) {
  // intersection between AB and CD
  // console.log(p);
  var a1 = B.y - A.y;
  var b1 = A.x - B.x;
  var c1 = a1 * A.x + b1 * A.y;

  var a2 = D.y - C.y;
  var b2 = C.x - D.x;
  var c2 = a2 * C.x + b2 * C.y;

  var det = a1 * b2 - a2 * b1;

  if (det == 0) {
    console.log("no intersection -- parallel");
  } else {
    var x = (b2 * c1 - b1 * c2) / det;
    var y = (a1 * c2 - a2 * c1) / det;
    strokeWeight(2);
    stroke(255, 0, 0);
    ellipse(x, y, 20, 20);
  }
}

function draw() {
  // put drawing code here
  background(255);
  cps[0].display();
  for (let i = 1; i < cps.length; i++) {
    cps[i].update();
    cps[i].display();
    connectCPs(cps[i - 1], cps[i]);
  }
  // for (let i = 0; i < cps.length - 4; i++) {
  //   intersect(cps[i].loc, cps[i + 1].loc, cps[i + 2].loc, cps[i + 3].loc);
  // }
}

function keyPressed() {
  console.log(key);
  if (key == "R") {
    initCPs();
  }
}

class ConnectPoint {
  constructor(x, y, dir) {
    this.loc = createVector(x, y);
    this.dir = dir;
    this.spacing = Math.floor(random(2, 7));
    this.rotVel = random(0.005, 0.013);
    this.pts = this.getPtsAroundCenter(x, y, dir, this.spacing);
  }
  getPtsAroundCenter(x, y, dir, spacing) {
    const ptArray = [];
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
    this.pts = this.getPtsAroundCenter(
      this.loc.x,
      this.loc.y,
      (this.dir += this.rotVel),
      this.spacing
    );
  }

  display() {
    stroke(0, 120);
    strokeWeight(0.3);
    noFill();
    ellipseMode(CENTER);
    this.pts.forEach(pt => {
      ellipse(pt.x, pt.y, 4, 4);
    });
  }
}
