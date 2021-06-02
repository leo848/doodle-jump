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
			textSize(50);
			textFont(game.fonts.snfont);

			translate(0, -game.yOff);

			rect(width / 2, height / 2, width - 80, 100, 20);
			rect(width / 2, height / 2 + 90, width - 80, 40, 20);

			let fakeYoff = 0;
			game.yOff = Number(game.yOff.toFixed(0));

			fill('black');
			text('Game over!', width / 2, height / 2 - 10);

			textSize(18);
			text(
				'Drücke [' + game.cLetter +'], um erneut zu spielen!',
				width / 2,
				height / 2 + 87,
			);

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
					fakeYoff -= -(game.yOff / 500).toFixed(0);
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
					clearInterval(iinter);
				}
			});

			this.delete();
		}

		if (this.pos.x < 0) {
			this.pos.x++;
			this.vel.x *= -0.75;
		} else if (this.pos.x > width) {
			this.pos.x--;
			this.vel.x *= -0.75;
		}

		this.vel.x *= 0.997;

		this.vel.limit(7);

		this.acc.add(createVector(0, 0.1));
		this.vel.add(this.acc);
		this.pos.add(this.vel);

		this.acc = createVector(0, 0);
	}

	show () {
		noStroke();
		fill('green');
		circle(this.pos.x, this.pos.y, 10);
	}

	delete () {
		this.show = this.update = this.delete = function (){};
	}
}
