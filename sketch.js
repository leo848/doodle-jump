let ball;
let plateaus = [];
let yOff = 0;
let debugMode = false;
let currentlyPaused = false;

let highscore = window.localStorage.getItem('dj_highscore') || 0;
let playedGames =
	JSON.parse(window.localStorage.getItem('dj_playedGames')) || [];

let smfont, snfont;
let sounds = {};

function restart (){
	sounds.gameover.stop();
	plateaus = [];
	yOff = 0;
	highscore = window.localStorage.getItem('dj_highscore') || 0;
	playedGames =
		JSON.parse(window.localStorage.getItem('dj_playedGames')) || [];

	setup();

	//window.location.reload();
}

function preload (){
	smfont = loadFont('sm.ttf');
	snfont = loadFont('sn.otf');
	sounds = {
		bounce   : loadSound('sounds/bounce.mp3'),
		bounce2  : loadSound('sounds/bounce2.mp3'),
		gameover : loadSound('sounds/gameover.mp3'),
		scored   : loadSound('sounds/scored.mp3'),
		ascend   : loadSound('sounds/ascend.mp3'),
		brick    : loadSound('sounds/brick.mp3'),
	};
}

function setup (){
	createCanvas(400, 600);

	//randomSeed('Leo');

	ball = new Ball(200, height - 100);
	plateaus.push(new Plateau(0, height - 20, width, 'grey'));

	let tempPHeight = 400;
	while (tempPHeight > -750) {
		plateaus.push(new Plateau(random(width - 50), tempPHeight, 50, 200));
		tempPHeight -= random(75, 125);
	}

	loop();
}

function draw (){
	rectMode(CORNER);
	background(32);
	if (debugMode) {
		text(
			'ball pos: ' + [ ball.pos.x.toFixed(2), ball.pos.y.toFixed(2) ],
			10,
			10,
		);
		text(
			'ball vel: ' + [ ball.vel.x.toFixed(2), ball.vel.y.toFixed(2) ],
			10,
			30,
		);
		text('yOff ' + yOff, 10, 50);
	}
	translate(0, yOff);

	if (keyIsPressed || mouseIsPressed) {
		if (key == 'ArrowLeft' || (mouseIsPressed && mouseX < width / 2)) {
			ball.acc.add(createVector(-0.07, 0));
		}
		if (key == 'ArrowRight' || (mouseIsPressed && mouseX > width / 2)) {
			ball.acc.add(createVector(0.07, 0));
		}
	}

	for (let i = 0; i < plateaus.length; i++) {
		plateaus[i].update();
		plateaus[i].show();
	}

	ball.update();
	ball.show();
}

function keyPressed (){
	if (key == 'r') {
		restart();
	}

	if (key == 'p') {
		currentlyPaused = !currentlyPaused;
		if (currentlyPaused) {
			noLoop();
			fill('white');
			rectMode(CENTER);
			rect(width / 2, height / 2, 100, 100);
		} else {
			loop();
		}
	}
}

function mousePressed (){
	return false;
}
function touchStart (){
	return false;
}
