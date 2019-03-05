let seed;
var lines = [];
function setup() {
    createCanvas(2000, 2000);
    background(100);
    seed = floor(random(9999999));
    stroke(255);
    randomSeed(seed);
    strokeCap(SQUARE);
}

function draw() {
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


class NLine {
    constructor(vec1, vec2, noiseScale) {
        this.pos1 = new p5.Vector(vec1.x, vec1.y);
        this.pos2 = new p5.Vector(vec2.x, vec2.y);
        this.noiseScale = 500;
        this.nz = 0;
        this.noiseOffset = 8000000.0;
        this.steps = p5.Vector.sub(vec1, vec2).mag();
    }


    display() {
        var currPos = new p5.Vector(this.pos1.x, this.pos1.y);
        console.log(this);
        stroke(255);
        strokeWeight(10);
        point(this.pos1.x, this.pos1.y);
        point(this.pos2.x, this.pos2.y);
        line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
        strokeWeight(4);

        beginShape(LINES);
        for(var i = 0.0; i < this.steps; i++) {
            var noiseWeight = sin((i/this.steps) * PI);
            var xyWeight = 1 - noiseWeight;
            var noisePos = new p5.Vector(
                noise(currPos.x/this.noiseScale, 0, this.nz)*width,
                noise(0, currPos.y/this.noiseScale, this.nz + this.noiseOffset)*height
            );
            // console.log(noisePos);
            var merge = new p5.Vector();
            merge.x = ((noisePos.x * noiseWeight) + (currPos.x * xyWeight));
            merge.y = ((noisePos.y * noiseWeight) + (currPos.y * xyWeight));
            // vertex(merge.x, merge.y);
            stroke(255, 0, 0);
            vertex(noisePos.x, noisePos.y);
            // point(currPos.x, currPos.y);
            currPos.add(p5.Vector.sub(this.pos2,this.pos1).normalize());
            // stroke(255);
       }
       endShape();
    }
}

