var cnv;
let music;
var fft;
var gui;
var buttonName = "PLAY / PAUSE";
var Play = false;
var myVolume = 0.5;
var myVolumeMin = 0;
var myVolumeMax = 1;
var myVolumeStep = 0.1;
var scoreEffect = ['Default', 'Follow Mouse', 'Rise', 'Rise2'];

let dots = [];
var total = 50;
let ranges = [0,1,2];
let easing = 0.05;

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
}

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  centerCanvas();
  cnv.parent('sketch-holder');
  music.setVolume(myVolume,1);
  fft = new p5.FFT(0.9,numOfBands);

  // Create Layout GUI
  gui = createGui().setPosition(width - 220, 20);
  gui.addButton(buttonName, play);
  gui.addGlobals('myVolume', 'scoreEffect');

  w = width / numOfBands;
  rectY = height - 400;

  for(var i=0; i<total; i++) {
    dots[i] = new Dot();
  }
}

function windowResized(){
  centerCanvas();
}

function loaded() {
  console.log('loaded');
}

function draw() {
  music.setVolume(myVolume,1);
  background(230,235,229);
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

  push();
  noStroke();
  colorMode(HSB,100);
  for(var sp=0; sp<spectrum.length; sp++){
    var amp = spectrum[sp];
    var ysp = map(amp, 0, 256, height,0);
    var test = map(sp,0,spectrum.length,45,100);
    fill(test,test,100);
    rect(sp*w, ysp, w-2, height-ysp);
  }
  pop();

  for(var i=0; i<dots.length; i++){
    dots[i].update();
    dots[i].draw();
  }
}

function play(){
   if (music.isPlaying()) {
    // .isPlaying() returns a boolean
    music.pause(); // .play() will resume from .pause() position
    console.log("Paused");
  } else {
    music.play();
    console.log("Playing");
  }
}

function keyPressed(){
  for (var i = 0; i < dots.length; i++) {
    dots[i].score();
  }
}

function Dot() {
  this.size = 30;

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
      fill(190,58,10,this.a);
      this.size = low;
      circle(this.x,this.y, this.size);
    }else if(this.range == 1) {
      fill(170,174,162,this.a);
      this.size = mid;
      circle(this.x,this.y, this.size);
    }
    else if(this.range == 2){
      fill(148,212,203,this.a);
      this.size = high;
      circle(this.x,this.y, this.size);
    }
  }

  this.update = function() {
    if(this.fade){
      if(scoreEffect == "Default"){
        //Should do nothings
      }else if(scoreEffect == "Follow Mouse"){
        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        this.x += dx * easing;
        this.y += dy * easing;
      }else if(scoreEffect == "Rise"){
        this.speed = -4;
        this.y += this.speed;
      }else if(scoreEffect == "Rise2"){
        var rx = random(-4,4);
        this.speed = -4;
        this.y += this.speed;
        this.x += rx;
      }
      this.a -= 2;
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
    if(this.y > rectY && this.y < rectY + rectHeight) {
      this.fade = true;
    }
  }

  this.init();
}