var cnv;
let music;
var fft;

let dots = [];
var total = 30;

var numOfBands = 256;
var w;

// var wPerCol;
// var numOfCol = 20;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function preload() {
  music = loadSound("https://asokry.github.io/myP5Summer/music/hello_how_are_you.mp3", loaded);
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  cnv.parent('sketch-holder');
  music.setVolume(0.1);
  fft = new p5.FFT(0.9,numOfBands);

  background(207,255,229);
  for (var i = 0; i < total; i++) {
    dots[i] = new Dot();
  }

  w = width / numOfBands;

  // wPerCol = abs(width / numOfCol);
  // for(var i = 0; i < numOfCol; i++){
  //   rect(i * wPerCol,0, wPerCol,height);
  // }
}

function windowResized(){
  //resizeCanvas(windowWidth, windowHeight);
  centerCanvas();
}

function loaded() {
  //music.play();
  console.log('loaded');
}

function draw() {
  background(207,255,229);
  var spectrum = fft.analyze();
  for(var sp=0; sp<spectrum.length; sp++){
    var amp = spectrum[sp];
    var ysp = map(amp, 0, 256, height,0);
    stroke(0);
    line(sp*w, height, sp*w, ysp);
  }

  for(var i=0; i<dots.length; i++){
    dots[i].update();
    dots[i].draw();
  }

  //rect(0, height-100, width, 100);
}

function mousePressed() {
  if (music.isPlaying()) {
    // .isPlaying() returns a boolean
    music.pause(); // .play() will resume from .pause() position
    console.log("Paused");
  } else {
    music.play();
    console.log('Playing');
  }
}

function Dot() {
  this.size = 40;
  this.speed = 5;

  this.init = function(){
    this.x = random(this.size, width - this.size);
    //this.x = startX;
    this.y = random(-height, -this.size);
  }

  this.draw = function() {
    noStroke();
    fill(255);
    circle(this.x,this.y, this.size);
  }

  this.update = function() {
    this.y += this.speed;
    if(this.y - this.size > height) {
      this.init();
    }
  }

  this.init();
}