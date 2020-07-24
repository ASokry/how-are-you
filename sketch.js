var cnv;
let bg;
let music;
var fft;
var paused;

let dots = [];
var total = 30;
let ranges = [0,1,2];

var low;
var mid;
var high;

var numOfBands = 256;
var w;

var rectHeight = 100;
var rectY = 0;

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function preload() {
  music = loadSound("https://asokry.github.io/myP5Summer/music/hello_how_are_you.mp3", loaded);
  bg = loadImage("Color Ripples.jpg");
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  cnv.parent('sketch-holder');
  music.setVolume(0.5);
  fft = new p5.FFT(0.9,numOfBands);

  //background(207,255,229);
  background(bg);
  w = width / numOfBands;
  rectY = height - rectHeight;

  for(var i=0; i<total; i++) {
    dots[i] = new Dot();
  }
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
  //background(207,255,229);
  background(bg);
  push();
  fill(255);
  strokeWeight(5);
  stroke(0);
  rect(0, rectY, width, rectHeight);
  pop();

  low = map(fft.getEnergy("lowMid"), 0,256,10,100);
  mid = map(fft.getEnergy("mid"), 0,256,10,100);
  high = map(fft.getEnergy("highMid"), 0,256,25,90);
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
}

function mousePressed() {
  if (music.isPlaying()) {
    // .isPlaying() returns a boolean
    music.pause(); // .play() will resume from .pause() position
    console.log("Paused");
    paused = true;
  } else {
    music.play();
    console.log("Playing");
    paused = false;
  }
}

function keyPressed(){
  for (var i = 0; i < dots.length; i++) {
    dots[i].score();
  }
}

function Dot() {
  this.size = 30;
  this.speed = 2;
  //this.fade = false;
  //this.a = 255;

  this.init = function(){
    this.x = random(this.size, width - this.size);
    this.y = random(-height, -this.size);
    this.fade = false;
    this.a = 255;
    this.range = random(ranges);
  }

  this.draw = function() {
    noStroke();
    if(this.range == 0){
      fill(255,0,0,this.a);
      this.size = low;
      circle(this.x,this.y, this.size);
    }else if(this.range == 1) {
      fill(0,255,0,this.a);
      this.size = mid;
      circle(this.x,this.y, this.size);
    }
    else if(this.range == 2){
      fill(0,0,255,this.a);
      this.size = high;
      circle(this.x,this.y, this.size);
    }
  }

  this.update = function() {
    if(this.fade){
      this.speed = 0;
      this.a -= 5;
    }else {
      if(this.range == 0){
        this.speed = 4;
        this.y += this.speed;
      }else if(this.range == 1) {
        this.speed = 3;
        this.y += this.speed;
      }
      else if(this.range == 2){
        this.speed = 2;
        this.y += this.speed;
      }
    }

    if(this.a <= 100){
      this.init();
    }

    if(this.y - this.size > height) {
      this.init();
    }
  }

  this.score = function() {
    if(this.y > rectY && this.y < height) {
      this.fade = true;
    }
  }

  this.init();
}