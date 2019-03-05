let seed;
var lights = [];
function setup() {
    createCanvas(2000, 2000);
    background(100);
    seed = floor(random(9999999));
    randomSeed(seed);
    strokeCap(SQUARE);
}

function draw() {
    background(100);
    lights.forEach(light => {
        light.display();
    });
    // if(frameCount % 20) addLight();
}

function keyPressed(event) {
    if(key == 'S') {
        saveCanvas('sketch_' + seed, 'jpeg');
    } else if (key == 'A') {
        addLight();
    }
}

function addLight() {
    // var vec1 = randomPointInCircle().add(new p5.Vector(width/2, height/4));
    // var vec2 = randomPointInCircle().add(new p5.Vector(width/2, height/4));
    var vec1 = randomPointInBox().add(new p5.Vector(width/2, height/4));
    var vec2 = randomPointInBox().add(new p5.Vector(width/2, height/4));
    var l = new Light(vec1, vec2);
    lights.push(l);
}
function randomPointInCircle() {
    const angle = random(8*PI);
    const radius = random(1000);
    return new p5.Vector(cos(angle)*radius, sin(angle)*radius);
}
function randomPointInBox() {
    const x = random(-width/2, width/2);
    const y = random(0, height/2);
    return new p5.Vector(x, y);
}

class Light {
    constructor(vec1, vec2) {
        this.pos1 = vec1;
        this.pos2 = vec2;
        this.depth = random(1, 5); // larger number closer
        this.length = p5.Vector.sub(vec1, vec2).mag();
    }

    display() {
        stroke(0);
        strokeWeight(this.depth);
        line(this.pos1.x, this.pos1.y, this.pos1.x, 0);
        line(this.pos2.x, this.pos2.y, this.pos2.x, 0);
        stroke(240, 240, 220);
        strokeWeight(this.depth* this.length * .0025);
        line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
    }

}

