var cnv;
let music;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function preload() {
  music = loadSound("music/hello_how_are_you.mp3", loaded);
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  cnv.parent('sketch-holder');
}

function windowResized(){
  //resizeCanvas(windowWidth, windowHeight);
  centerCanvas();
  background(207,255,229);
}

function loaded() {
  //music.play();
  console.log('loaded');
}

function draw() {
  background(207,255,229);
}

function mousePressed() {
  if (music.isPlaying()) {
    // .isPlaying() returns a boolean
    music.pause(); // .play() will resume from .pause() position
    background(255, 0, 0);
  } else {
    music.play();
    console.log('Playing');
    background(0, 255, 0);
  }
}