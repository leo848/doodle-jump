class Plateau {
	constructor (x, y, width, color) {
		this.pos = createVector(x, y);
		this.width = width;
		this.color = color || 200;
	}

	update () {
		if (
			Math.abs(ball.pos.y - this.pos.y) < 10 &&
			Math.abs(ball.pos.x - this.pos.x - this.width / 2) <
				this.width / 2 &&
			ball.vel.y > 0
		) {
			ball.vel.y = -6;
			if (this.pos.y - 400 < -yOff) {
				let iinterval = setInterval(() => {
					if (yOff < -(this.pos.y - 400)) {
						yOff += 2.5;
					} else {
						yOff = -(this.pos.y - 400);
						clearInterval(iinterval);
					}
				}, 5);
				let ran = random();
				if (ran < 1 / 2) {
					try {
						sounds.bounce.play();
					} catch (e) {}
					plateaus.push(
						new Plateau(
							random(width - 50),
							plateaus[plateaus.length - 1].pos.y -
								random(80, 125),
							50,
						),
					);
				} else if (ran < 2 / 3) {
					try {
						sounds.bounce2.play();
					} catch (e) {}
					plateaus.push(
						new HorizontalMovingPlateau(
							random(width - 50),
							plateaus[plateaus.length - 1].pos.y -
								random(80, 125),
							50,
							120,
							random(0.75, 2.5),
						),
					);
				} else if (ran < 5 / 6) {
					try {
						sounds.bounce2.play();
					} catch (e) {}
					plateaus.push(
						new VerticalMovingPlateau(
							random(width - 50),
							plateaus[plateaus.length - 1].pos.y -
								random(100, 120),
							50,
							120,
							plateaus[plateaus.length - 1].pos.y -
								random(300, 500),
							random(0.75, 2.5),
						),
					);
				} else {
					try {
						sounds.bounce.play();
					} catch (e) {}
					plateaus.push(
						new BreakingPlateau(
							random(width - 50),
							plateaus[plateaus.length - 1].pos.y -
								random(80, 125),
							50,
							'brown',
						),
					);
				}
			}
			if (this.break) {
				push();
				sounds.brick.setVolume(1.5);
				sounds.brick.play();
				pop();
				this.delete();
			}
		}

		if (this.pos.y > height + yOff + 100) {
			this.delete();
		}
	}

	show () {
		push();
		fill(this.color);
		rect(this.pos.x, this.pos.y, this.width, 15);
		pop();
	}

	delete () {
		this.update = this.show = this.delete = () => {};
		plateaus.filter((v) => v.pos.x * v.pos.y !== this.pos.x * this.pos.y);
		print('deleted smth');
	}
}

class HorizontalMovingPlateau extends Plateau {
	constructor (_x, y, width, color, speed) {
		super(0, y, width, color);
		this.vel = createVector(speed, 0);
	}
	update () {
		if (this.pos.x < 0) {
			this.pos.x++;
			this.vel.mult(-1);
		} else if (this.pos.x > width - this.width) {
			this.pos.x--;
			this.vel.mult(-1);
		}

		this.pos.add(this.vel);
		super.update();
	}
}

class VerticalMovingPlateau extends Plateau {
	constructor (x, y, width, color, maxY, speed) {
		super(x, y, width, color);
		this.minY = y;
		this.maxY = maxY;
		this.vel = createVector(0, -speed);
	}

	update () {
		if (this.pos.y > this.minY) {
			this.pos.y--;
			this.vel.mult(-1);
		} else if (this.pos.y < this.maxY) {
			this.pos.y++;
			this.vel.mult(-1);
		}

		this.pos.add(this.vel);

		super.update();
	}
}

class BreakingPlateau extends Plateau {
	constructor (x, y, width, color) {
		super(x, y, width, color);
		this.break = true;
	}
	update () {
		super.update();
		if (
			Math.abs(ball.pos.y - this.pos.y) < 10 &&
			Math.abs(ball.pos.x - this.pos.x - this.width / 2) <
				this.width / 2 &&
			ball.vel.y > 0
		) {
			print('yes deleted');
			this.delete();
		}
	}
}
