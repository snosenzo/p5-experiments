const noiseScale = 150.0;
let particles = [];
const sqSize = 70;
const sqSpacing = 20;
const numParticles = 1000;
const circleRadius = 750;
var angleOfRotation = .5;
var nz = 0;
let seed;

function setup() {
    createCanvas(2000, 4000);
    background(255);
    seed = floor(random(9999999));
    randomSeed(seed);
    smooth();
    // square formation
    for(var y = 0; y < sqSize; y++) {
        for(var x = 0; x < sqSize; x++) {
            var p = new Particle(width/2 + (x - sqSize/2) * sqSpacing, height/2 + (y - sqSize/2)*sqSpacing*4);
            particles.push(p);
        }
    }
    // for(var i = 0; i < TWO_PI; i+=TWO_PI/numParticles) {
    //     var p = new Particle(width/2 + cos(i)*circleRadius, height/2 + sin(i) * circleRadius);
    //     particles.push(p);
    // }
    fill(0);
    ellipseMode(CENTER);
    // ellipse(width/2, height/2, circleRadius*2);
}

function draw() {
    // noStroke();
    for (var i = 0; i < particles.length; i++ ) {
        particles[i].update();
        particles[i].display();
    }
    angleOfRotation += .00001;
     // nz += .005;
}

function keyPressed(event) {
    if(key == 'S') {
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

        if(random() > .1) {
            vel = curlNoise(this.pos.x, this.pos.y);
        } else {
            vel = vecFromNoise(this.pos.x, this.pos.y);
        }
        vel.normalize();
        this.pos.add(vel);
    }

    display() {
        stroke(255, 150 * noise(this.pos.x, this.pos.y));
        if(dist(this.pos.x, this.pos.y, width/2, height/2) > circleRadius) {
            stroke(0,  70);
        }

        stroke(0,  map(this.pos.y, 0 , height, 60, 1 ));
        strokeWeight(1);
        point(this.pos.x,
            ((this.pos.y-height/2) * sin(angleOfRotation) + height/2) + 600 * noise(this.pos.x/(noiseScale * 2),this.pos.y/(noiseScale * 2), nz));
    }

}


function sqVecFromNoise(x, y) {
    var dirAngle = Math.floor(map(noise(x/noiseScale, y/noiseScale, nz), 0, 1, 0, 8));
    dirAngle = (dirAngle * (TWO_PI/8) * 2) - TWO_PI;
    return p5.Vector.fromAngle(dirAngle);
}
function vecFromNoise(x, y) {
    var dirAngle = map(noise(x/noiseScale, y/noiseScale, nz), 0, 1, -TWO_PI, TWO_PI);
    return p5.Vector.fromAngle(dirAngle);
}
function curlNoise(x, y) {
    const eps = 1.0/(noiseScale);
    let n1, n2, a, b;
    x = x / (noiseScale);
    y = y / (noiseScale);
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
    var dof = 2;
    var flooredangle = TWO_PI * (floor((angle / TWO_PI)*dof)/float(dof));
    curl = p5.Vector.fromAngle(flooredangle);
    // curl.normalize();
    return curl;
}

