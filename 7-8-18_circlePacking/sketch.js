var circles = [];
var wMargin = 100;
var hMargin = 100;
var maxSize = 150;
var bgColor;

function setup() {
    createCanvas(1000, 1000);
    ellipseMode(CENTER);
    bgColor = color(0, 0, 0);
    background(bgColor);
    var newpt = new p5.Vector(random(wMargin, width-wMargin), random(hMargin, height-hMargin));
    var newCircle = new Circle(newpt, color(0));
    circles.push(newCircle);
}

function draw() {
    // background(bgColor);

    if(circles.length > 0 && circles[circles.length-1].growing == false) {
        var newpt = new p5.Vector(random(wMargin, width-wMargin), random(hMargin, height-hMargin));
        while(checkPt(newpt)) {
            newpt = new p5.Vector(random(wMargin, width-wMargin), random(hMargin, height-hMargin));
        }

        var newCircle = new Circle(newpt, color(0));
        circles.push(newCircle);
    }

    circles.forEach((c1, i) => {
        for(var j = i + 1; j <  circles.length - 1; j++ ) {
            var c2 = circles[j];
            if(circleCollision(c1, c2)) {
                c1.growing = false;
                c2.growing = false;
            }
        }
        c1.grow();
        c1.show();
    })
}

function checkPt(pt) {
    var ptCol = get(pt.x, pt.y);
    return ptCol == bgColor ? true : false;
}

function circleCollision(c1, c2) {
    if(dist(c1.pos.x, c1.pos.y, c2.pos.x, c2.pos.y) > (c2.r+c1.r)) {
        return true;
    } else {
        return false;
    }
}


class Circle {
   constructor(x, y, color) {
       this.r = 1;
       this.pos = new p5.Vector(x, y);
       this.color = color;
       this.growing = true;
   }

   grow() {
       if (this.growing) {
           this.r += 1;
       }
       if (this.r > maxSize) {
           this.growing = false;
       }
   }

   show() {
       stroke(255);
       fill(255);
       strokeWeight(2);
       ellipse(this.pos.x, this.pos.y, this.r, this.r);
   }
}