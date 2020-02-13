function sqVecFromNoise(x, y, p5) {
  var dirAngle = Math.floor(
    map(p5.noise(x / noiseScale, y / noiseScale, nz), 0, 1, 0, 8)
  );
  dirAngle = dirAngle * ((Math.PI * 2) / 8) * 2 - Math.PI * 2;
  return p5.Vector.fromAngle(dirAngle);
}
function vecFromNoise(x, y, p5) {
  var dirAngle = p5.map(
    p5.noise(x / noiseScale, y / noiseScale, nz),
    0,
    1,
    -(Math.PI * 2),
    Math.PI * 2
  );
  return p5.Vector.fromAngle(dirAngle);
}
function curlNoise(x, y, p5) {
  const eps = 1.0 / noiseScale;
  let n1, n2, a, b;
  x = x / noiseScale;
  y = y / noiseScale;
  n1 = p5.noise(x, y + eps, nz);
  n2 = p5.noise(x, y - eps, nz);
  a = (n1 - n2) / (2 * eps);

  n1 = p5.noise(x + eps, y, nz);
  n2 = p5.noise(x - eps, y, nz);

  b = (n1 - n2) / (2 * eps);

  var curl = p5.createVector(a, -b);
  curl.normalize();
  return curl;
}
function curlNoiseFloored(x, y, p5) {
  const eps = 1.0 / noiseScale;
  noiseDetail(2, 0.5);
  let n1, n2, a, b;
  x = x / noiseScale;
  y = y / noiseScale;
  n1 = p5.noise(x, y + eps, nz);
  n2 = p5.noise(x, y - eps, nz);
  a = (n1 - n2) / (2 * eps);

  n1 = p5.noise(x + eps, y, nz);
  n2 = p5.noise(x - eps, y, nz);

  b = (n1 - n2) / (2 * eps);

  var curl = createVector(a, -b);
  var angle = curl.heading();
  var dof = 4;
  var flooredangle =
    Math.PI * 2 * (floor((angle / (Math.PI * 2)) * dof) / float(dof));
  curl = p5.Vector.fromAngle(flooredangle);
  // curl.normalize();
  return curl;
}
