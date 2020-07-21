var cnv;
let button;
var switched = false;

function centerCanvas() {
 	var x = (windowWidth - width) / 2;
 	var y = (windowHeight - height) / 2;
 	cnv.position(x, y);
 	background(0);
}

function setup(){
	cnv = createCanvas(windowWidth, windowHeight);
 	centerCanvas();
 	cnv.parent('sketch-holder');
 	button = createButton('click me');
	button.position(width/2, height/2);
	button.mousePressed(loadScript);
}

function windowResized(){
	//resizeCanvas(windowWidth, windowHeight);
	centerCanvas();
	background(0);
}

function loadScript() {
	if(switched == false){
		var tag = document.createElement("script");
	tag.language = "javascript";
	tag.src = "p5_lib/addons/p5.sound.js";
	document.getElementsByTagName("head")[0].appendChild(tag);
	switched = true;
	}else{
		var newTag = document.createElement("script");
	newTag.type = "text/javascript";
	newTag.src = "sketch.js";
	document.getElementsByTagName("head")[0].appendChild(newTag);
	}
}