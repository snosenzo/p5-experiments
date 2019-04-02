export const ellipseStroke = (loc, strokeSize) => {
  ellipse(loc.x, loc.y, strokeSize, strokeSize);
};

export const rectStroke = (loc, strokeSize) => {
  rectMode(CENTER);
  rect(loc.x, loc.y, 1, strokeSize);
};
export const diagonalLineStroke = (loc, strokeSize) => {
  line(
    loc.x + strokeSize,
    loc.y + strokeSize,
    loc.x - strokeSize,
    loc.y - strokeSize
  );
};
export const diagonalLineNoiseStroke = (loc, strokeSize) => {
  line(
    loc.x + strokeSize,
    loc.y + strokeSize * noise(strokeSize),
    loc.x - strokeSize * noise(strokeSize),
    loc.y - strokeSize
  );
};

export const noiseLineStroke = (loc, strokeSize) => {
  const xOffset = strokeSize * (-0.5 + noise(loc.x / 10.0));
  const yOffset = strokeSize * (-0.5 + noise(loc.y / 10.0));
  ellipse(loc.x + xOffset, loc.y + yOffset, strokeSize, strokeSize);
};

export const lerpPointWithStroke = (
  startLoc,
  endLoc,
  startStroke,
  endStroke,
  numSteps,
  displayStroke
) => {
  const stepSize = 1.0 / numSteps;
  const incLoc = startLoc.copy();
  let incStroke = startStroke;
  for (let i = 0; i <= 1; i += stepSize) {
    incLoc.x = lerp(startLoc.x, endLoc.x, i);
    incLoc.y = lerp(startLoc.y, endLoc.y, i);
    incStroke = lerp(startStroke, endStroke, i);
    displayStroke(incLoc, incStroke);
  }
};
