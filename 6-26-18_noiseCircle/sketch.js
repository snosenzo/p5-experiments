var noiseScale = 90.0;
var particles = [];
var sqSize = 10;
var sqSpacing = 80;
var nz = 0;
function setup() {
    createCanvas(2000, 2000);
    background(255);
    smooth();
    for(var y = 0; y < sqSize; y++) {
        for(var x = 0; x < sqSize; x++) {
            var p = new Particle(width/2 + (x - sqSize/2) * sqSpacing, height/2 + (y - sqSize/2)*sqSpacing);
            particles.push(p);
        }
    }
    fill(0);
    ellipse(width/2, height/2, 1500);
}

function draw() {
    // noStroke();
    for (var i = 0; i < particles.length; i++ ) {
        particles[i].update();
        particles[i].display();
    }
    // nz += .01;
}


class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);

    }

    update() {
        var vel = p5.Vector.fromAngle(dirFromNoise(this.pos.x, this.pos.y), 1);
        this.pos.add(vel);
    }

    display() {
        stroke(255, 20);
        strokeWeight(2);
        point(this.pos.x, this.pos.y);
    }

}


function dirFromNoise(x, y) {
    var dirAngle = map(noise(x/noiseScale, y/noiseScale, nz), 0, 1, -TWO_PI, TWO_PI);
    return dirAngle;
}

