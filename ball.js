class Ball {
	constructor (x, y) {
		this.pos = createVector(x, y);
		this.vel = createVector(0, 0);
		this.acc = createVector(0, 0);
	}

	update () {
		if (this.pos.y > height - game.yOff) {
			print('gmae over');
			noLoop();
			fill(200);
			filter(BLUR, 5);
			rectMode(CENTER);
			textAlign(CENTER, CENTER);

			textFont(game.fonts.snfont);

			translate(0, -game.yOff);

			let fakeYoff = 0;
			game.yOff = Number(game.yOff.toFixed(0));

			game.stats.allScores.push(game.yOff);

			textSize(100);

			textAlign(CENTER, CENTER);

			let iinter = setInterval(() => {
				if (fakeYoff <= game.yOff) {
					if (!game.sounds.gameover.isPlaying()) {
						try {
							game.sounds.gameover.play();
						} catch (e) {}
					}
					fill(175);
					rect(width / 2, 100, width, 200);
					fill('black');
					text(fakeYoff.toFixed(0), width / 2, 100);
					fakeYoff -= -(game.yOff / 500 + 1).toFixed(0);

					window.localStorage.setItem(
						'dj_allScores',
						JSON.stringify(game.stats.allScores),
					);
				} else {
					fakeYoff = game.yOff;
					game.sounds.scored.play();
					if (game.yOff > game.highscore) {
						game.highscore = game.yOff;
						window.localStorage.setItem(
							'dj_highscore',
							game.highscore.toString(),
						);
					}

					fill(200);

					rect(width / 2, height / 2, width - 80, 100, 20);
					rect(width / 2, height / 2 + 90, width - 80, 40, 20);

					textSize(18);

					fill('black');

					text(
						'Drücke [' + game.cLetter + '], um erneut zu spielen!',
						width / 2,
						height / 2 + 87,
					);
					textSize(50);
					text('Game over!', width / 2, height / 2 - 10);
					clearInterval(iinter);
				}
			});

			this.delete();
		}

		if (this.pos.x < 0) {
			this.pos.x++;
			this.vel.x *= -game.options.wallImpactEnergyReturn;
		} else if (this.pos.x > width) {
			this.pos.x--;
			this.vel.x *= -game.options.wallImpactEnergyReturn;
		}

		this.vel.x *= game.options.airFriction;

		this.vel.limit(game.options.terminalVelocity);

		this.acc.add(
			createVector(game.options.gravity.x, game.options.gravity.y),
		);
		this.vel.add(this.acc);
		this.pos.add(this.vel);

		this.acc = createVector(0, 0);

		game.ballPrevPositions.push(createVector(this.pos.x, this.pos.y));

		if (game.ballPrevPositions.length > game.options.trailLength) {
			game.ballPrevPositions.shift();
		}
	}

	show () {
		noStroke();
		fill('green');
		circle(this.pos.x, this.pos.y, 10);
		stroke(200, 100);
		for (let i = 0; i < game.ballPrevPositions.length - 1; i++) {
			line(
				game.ballPrevPositions[i].x,
				game.ballPrevPositions[i].y,
				game.ballPrevPositions[i + 1].x,
				game.ballPrevPositions[i + 1].y,
			);
		}
		fill('green');
		noStroke();
	}

	delete () {
		this.show = this.update = this.delete = function (){};
	}
}
