let line1;
function setup() {
    createCanvas(1000, 1000);
    background(0);
    stroke(255);
    line1 = new Line(width/2, height/2, 200, 0 );
    rectMode(CENTER);
    colorMode();

}

function draw() {
    background(0);
    line1.update();
    line1.display();
    blendMode(ADD);

}


function keyPressed(event) {
    if(key == 'S') {
        saveCanvas('sketch_' + seed, 'jpeg');
    } else if (key == 'A') {

    }
}



class Line {

    constructor(x, y, length, angle, speed = .01) {
        this.pos = new p5.Vector();
        this.pos.x = x;
        this.pos.y = y;
        this.length = length;
        this.angle = angle;
        this.speed = speed;
        var rand = random(3);
        if(rand < 1) {
            this.color = color(10, 0, 0);
        } else if (rand < 2) {
            this.color = color(0, 10, 0);
        } else {
            this.color = color(0, 0, 10);
        }
        // var rand = random(2);

        this.children = [];
        if (this.length * Line.childLengthMultiplier > Line.minLength) {
            this.children = [
                new Line(
                    (this.length * .5 + 15) * cos(this.angle),
                    (this.length * .6 + 15) * sin(this.angle),
                    this.length * Line.childLengthMultiplier,
                    this.angle+ .1325239,
                    this.speed*-.6
                ),
                new Line(
                    -(this.length * .6 + 15) * cos(this.angle),
                    -(this.length * .6 + 15) * sin(this.angle),
                    this.length * Line.childLengthMultiplier,
                    this.angle - .123095239,
                    this.speed*-.6,
                ),
            ]
        }
        // console.log(this.children);
    }

    update() {
        this.angle += this.speed;
        this.children.forEach(child => child.update());
    }

    display() {
        // console.log(this);
        translate(this.pos.x, this.pos.y);
        rotate(this.angle);
        stroke(this.color);
        noFill();
        // fill(this.color);
        rect(0, 0, this.length/2, this.length/2);
        this.children.forEach(child => child.display());
        rotate(-this.angle);
        translate(-this.pos.x, -this.pos.y);
    }
}
Line.minLength = 10
Line.childLengthMultiplier = .7

