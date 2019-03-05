let seed;
var lines = [];
const circleRadius = 500;

function setup() {
    createCanvas(1000, 1000);
    background(0);
    ellipseMode(CENTER);
    strokeWeight(50);
    noSmooth();
}

function draw() {
    blendMode(NORMAL);
    background(0);

    noFill();
    stroke(255);
    applyMatrix();
    translate(width/2, height/2);
    rotate(frameCount/180 * PI);
    blendMode(ADD);
    // ellipse(0, 0, circleRadius, circleRadius);
    stroke(255, 0, 0);
    translate(circleRadius/30 * sin(frameCount/180 * PI/3 + 300), (circleRadius/30) * cos(frameCount/90));
    ellipse(0, 0, circleRadius, circleRadius);
    stroke(0, 255, 0);
    translate((circleRadius/30) * sin(frameCount/180 * PI), (circleRadius/30) * cos(frameCount/180));
    ellipse(0, 0, circleRadius, circleRadius);
    stroke(0, 0, 255);
    translate((circleRadius/30) * cos(frameCount/180 * PI), (circleRadius/30) * sin(frameCount/180));
    ellipse(0, 0, circleRadius, circleRadius);
    blendMode(MULTIPLY);
    rectMode(CENTER);
    noStroke();
    fill(2, 2, 2);
    rect(0, 0, 80, circleRadius*2);
    noFill();
    resetMatrix();



}


function noiseCircle() {

}

function keyPressed(event) {
    if(key == 'S') {
        saveCanvas('sketch_' + seed, 'jpeg');
    } else if (key == 'A') {
        var vec1 = new p5.Vector(random(0, width), random(0, height));
        var vec2 = new p5.Vector(random(0, width), random(0, height));
        // var vec1 = new p5.Vector(100, height/2);
        // var vec2 = new p5.Vector(width-100, height/2);
        var nline = new NLine(vec1, vec2);
        nline.display();
    }
}



