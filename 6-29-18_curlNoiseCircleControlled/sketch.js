const noiseScale = 150.0;
let particles = [];
const sqSize = 10;
const sqSpacing = 100;
const numParticles = 1000;
const circleRadius = 750;
var nz = 0;
let seed;

function setup() {
    createCanvas(2000, 4000);
    background(255);
    seed = floor(random(9999999));
    randomSeed(seed);
    smooth();
    // square formation
    // for(var y = 0; y < sqSize; y++) {
    //     for(var x = 0; x < sqSize; x++) {
    //         var p = new Particle(width/2 + (x - sqSize/2) * sqSpacing, height/2 + (y - sqSize/2)*sqSpacing);
    //         particles.push(p);
    //     }
    // }
    for(var i = 0; i < TWO_PI; i+=TWO_PI/numParticles) {
        var p = new Particle(width/2 + cos(i)*circleRadius, height/2 + sin(i) * circleRadius);
        particles.push(p);
    }
    fill(0);
    ellipseMode(CENTER);
    ellipse(width/2, height/2, circleRadius*2);
}

function draw() {
    // noStroke();
    for (var i = 0; i < particles.length; i++ ) {
        particles[i].update();
        particles[i].display();
    }
     nz += .005;
}

function keyPressed() {
    if(key == 's') {
        saveCanvas('sketch_' + seed, 'jpeg');
    }
}


class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);

    }

    update() {
        var angle;
        var vel;
        if(dist(this.pos.x, this.pos.y, width/2, height/2) > circleRadius) {
            angle = sqDirFromNoise(this.pos.x, this.pos.y);
            vel = p5.Vector.fromAngle(angle, 1);
        } else {
            // angle = dirFromNoise(this.pos.x, this.pos.y);
          vel = curlNoiseFloored(this.pos.x, this.pos.y);
          vel.y -= .8;
          vel.normalize();
        }
        this.pos.add(vel);
    }

    display() {
        stroke(255, 70);
        if(dist(this.pos.x, this.pos.y, width/2, height/2) > circleRadius) {
            stroke(0, 70);
        }

        strokeWeight(2);
        point(this.pos.x, this.pos.y);
    }

}


function sqDirFromNoise(x, y) {
    var dirAngle = Math.floor(map(noise(x/noiseScale, y/noiseScale, nz), 0, 1, 0, 8));
    dirAngle = (dirAngle * (TWO_PI/8) * 2) - TWO_PI;
    return dirAngle;
}
function dirFromNoise(x, y) {
    var dirAngle = map(noise(x/noiseScale, y/noiseScale, nz), 0, 1, -TWO_PI, TWO_PI);
    return dirAngle;
}
function curlNoise(x, y) {
    const eps = 1.0/noiseScale;
    let n1, n2, a, b;
    x = x / noiseScale;
    y = y / noiseScale;
    n1 = noise(x, y + eps, nz);
    n2 = noise(x, y - eps, nz);
    a = (n1 - n2) / (2 * eps);

    n1 = noise(x + eps, y, nz);
    n2 = noise(x - eps, y, nz);

    b = (n1 - n2)/(2 * eps);

    var curl = createVector(a, -b);
    curl.normalize();
    return curl;
}
function curlNoiseFloored(x, y) {
    const eps = 1.0/noiseScale;
    noiseDetail(2, .5);
    let n1, n2, a, b;
    x = x / noiseScale;
    y = y / noiseScale;
    n1 = noise(x, y + eps, nz);
    n2 = noise(x, y - eps, nz);
    a = (n1 - n2) / (2 * eps);

    n1 = noise(x + eps, y, nz);
    n2 = noise(x - eps, y, nz);

    b = (n1 - n2)/(2 * eps);

    var curl = createVector(a, -b);
    var angle = curl.heading();
    var dof = 6;
    var flooredangle = TWO_PI * (floor((angle / TWO_PI)*dof)/float(dof));
    curl = p5.Vector.fromAngle(flooredangle);
    // curl.normalize();
    return curl;
}

