const numPtsPerConnect = 9;
const numCps = 10;
const cps = [];
function setup() {
  createCanvas(800, 800);
  // put setup code here
  background(255);
  for (let i = 0; i < numCps; i++) {
    const cp = new ConnectPoint(
      random(100, width - 100),
      random(100, height - 100),
      random(TWO_PI)
    );
    cps.push(cp);
  }
  strokeWeight(0.3);
  smooth();
}
function connectCPs(cp1, cp2) {
  stroke(0, 120);
  cp1.pts.forEach((pt1, index) => {
    const pt2 = cp2.pts[index];
    line(pt1.x, pt1.y, pt2.x, pt2.y);
  });
}
function draw() {
  // put drawing code here
  background(255);
  cps[0].display();
  for (let i = 1; i < cps.length; i++) {
    cps[i].display();
    connectCPs(cps[i - 1], cps[i]);
  }
}

class ConnectPoint {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.pts = this.getPtsAroundCenter(x, y, dir, Math.floor(random(5, 15)));
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

  display() {
    stroke(0, 120);
    noFill();
    ellipseMode(CENTER);
    this.pts.forEach(pt => {
      ellipse(pt.x, pt.y, 4, 4);
    });
  }
}
