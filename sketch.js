let game = {
	plateaus        : [],
	yOff            : 0,
	debugMode       : false,
	currentlyPaused : false,
	highscore       : window.localStorage.getItem('dj_highscore') || 0,
	playedGames     :
		JSON.parse(window.localStorage.getItem('dj_playedGames')) || [],
	fonts           : {},
	sounds          : {},
};



function restart (){
	game.sounds.gameover.stop();
	game.plateaus = [];
	game.yOff = 0;
	game.highscore = window.localStorage.getItem('dj_highscore') || 0;
	game.playedGames =
		JSON.parse(window.localStorage.getItem('dj_playedGames')) || [];

	setup();

	//window.location.reload();
}

function preload (){
	game.fonts.smfont = loadFont('sm.ttf');
	game.fonts.snfont = loadFont('sn.otf');
	game.sounds = {
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

	game.ball = new Ball(200, height - 100);
	game.plateaus.push(new Plateau(0, height - 20, width, 'grey'));

	let tempPHeight = 400;
	while (tempPHeight > -750) {
		game.plateaus.push(
			new Plateau(random(width - 50), tempPHeight, 50, 200),
		);
		tempPHeight -= random(75, 125);
	}

	loop();
}

function draw (){
	rectMode(CORNER);
	background(32);
	if (game.debugMode) {
		text(
			'ball pos: ' + [ game.ball.pos.x.toFixed(2), game.ball.pos.y.toFixed(2) ],
			10,
			10,
		);
		text(
			'ball vel: ' + [ game.ball.vel.x.toFixed(2), game.ball.vel.y.toFixed(2) ],
			10,
			30,
		);
		text('game.yOff ' + game.yOff, 10, 50);
	}
	translate(0, game.yOff);

	if (keyIsPressed || mouseIsPressed) {
		if (key == 'ArrowLeft' || (mouseIsPressed && mouseX < width / 2)) {
			game.ball.acc.add(createVector(-0.07, 0));
		}
		if (key == 'ArrowRight' || (mouseIsPressed && mouseX > width / 2)) {
			game.ball.acc.add(createVector(0.07, 0));
		}
	}

	for (let i = 0; i < game.plateaus.length; i++) {
		game.plateaus[i].update();
		game.plateaus[i].show();
	}

	game.ball.update();
	game.ball.show();
}

function keyPressed (){
	if (key == 'r') {
		restart();
	}

	if (key == 'p') {
		game.currentlyPaused = !game.currentlyPaused;
		if (game.currentlyPaused) {
			noLoop();
			fill('white');
			rectMode(CENTER);
			filter(BLUR, 5);
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
