// turtle graphics
var x, y;
var currAngle = 0;
var step = 40;
var angle;

var theString = 'A'; // axiom or start of string
var numLoops = 7;
var rules = [['A', '-BF+AFA+FB-'], ['B', '+AF-BFB-FA+']];
var noiseScale = 100;
var strLoc = 0;

function setup() {
    createCanvas(4000, 4000);
    background(255);
    stroke(0, 0, 0, 255);
    angle = 90;
    x = 500;
    y = height - 500;
    for (var i = 0; i < numLoops; i++) {
        theString = lindenmayer(theString);
    }
    strokeWeight(3);
}

function draw() {

}

function keyPressed(event) {
    console.log(key)
    if(key == 'R') {
          background(255);
    }
    if(key == 'N') {
          loopDraw(900);
    }
}
function loopDraw(numIterations) {
    for(var i = 0; i < numIterations; i++) {
        // draw the current character in the string:
        drawIt(theString[strLoc]);
        console.log({x: x, y: y});

        strLoc++;
        strLoc > theString.length - 1 ? strLoc = 0 : strLoc;
    }
}

function lindenmayer(s) {
    var outString = '';

    // iterate through 'therules' looking for symbol matches:
    for (var i = 0; i < s.length; i++) {
        var match = false;
        for(var j = 0; j < rules.length; j++) {
            if(s[i] == rules[j][0]) {
                outString += rules[j][1];
                match = true;
                break;
            }
        }
        if(!match) outString+=s[i];
    }
    return outString;
}

// draws turtle commands
function drawIt(k) {
    if(k=='F') {
        // step = map(noise(x/noiseScale, y/noiseScale, 0), 0, 1, 5, 30);
        var x1 = x + step * cos(radians(currAngle));
        var y1 = y + step * sin(radians(currAngle));
        lineThroughNoise(x, y, x1, y1);
        x = x1;
        y = y1;
    } else if(k == '+') {
        currAngle += angle;
    } else if (k == '-') {
        currAngle -= angle;
    }

    var radius = random(0, 15);
    fill(30, 0, 80 + random(-40, 40));
    // ellipse(x, y, radius, radius);
}

function lineThroughNoise(x1, y1, x2, y2) {

   // var nx2 = map(noise((x2/width)*2.0, 0), 0, 1, 0, width );
   // var ny2 = map(noise(0, (y2/height)*2.0), 0, 1, 0, height );
   beginShape();
   for(var i = 0; i < step; i++ ) {
      var xtemp = lerp(x1, x2, .6) ;
      var ytemp = lerp(y1, y2, .6);
      var nxtemp = map(noise((xtemp/width)*2.0, 0), 0, 1, 0, width );
      var nytemp = map(noise(0, (ytemp/height)*2.0), 0, 1, 0, height );
      vertex(nxtemp, nytemp);
   }
   endShape();
}
// class Turtle {
//     constructor(x, y, angle)
// }