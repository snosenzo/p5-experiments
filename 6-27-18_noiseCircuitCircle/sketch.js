const noiseScale = 150.0;
let particles = [];
const sqSize = 10;
const sqSpacing = 100;
const numParticles = 1000;
const circleRadius = 750;
var nz = 0;
let seed;

function setup() {
    createCanvas(2000, 2000);
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
     nz += .0005;
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
        if(dist(this.pos.x, this.pos.y, width/2, height/2) > circleRadius) {
            angle = sqDirFromNoise(this.pos.x, this.pos.y);
        } else {
            angle = dirFromNoise(this.pos.x, this.pos.y);
        }
        var vel = p5.Vector.fromAngle(angle, 1);
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

