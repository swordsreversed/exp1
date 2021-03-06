function ghostCursor(options) {
	let hasWrapperEl = options && options.element;
	let element = hasWrapperEl || document.body;

	let width = window.innerWidth;
	let height = window.innerHeight;
	let cursor = { x: width / 2, y: width / 2 };
	let particles = [];
	let canvas, context;

	let baseImage = new Image();
	baseImage.src =
		'data:image/png;base64,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';

	function init() {
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d');
		canvas.style.top = '0px';
		canvas.style.left = '0px';
		canvas.style.pointerEvents = 'none';

		if (hasWrapperEl) {
			canvas.style.position = 'absolute';
			element.appendChild(canvas);
			canvas.width = element.clientWidth;
			canvas.height = element.clientHeight;
		} else {
			canvas.style.position = 'fixed';
			document.body.appendChild(canvas);
			canvas.width = width;
			canvas.height = height;
		}

		bindEvents();
		loop();
	}

	// Bind events that are needed
	function bindEvents() {
		element.addEventListener('mousemove', onMouseMove);
		element.addEventListener('touchmove', onTouchMove, { passive: true });
		element.addEventListener('touchstart', onTouchMove, { passive: true });
		window.addEventListener('resize', onWindowResize);
	}

	function onWindowResize(e) {
		width = window.innerWidth;
		height = window.innerHeight;

		if (hasWrapperEl) {
			canvas.width = element.clientWidth;
			canvas.height = element.clientHeight;
		} else {
			canvas.width = width;
			canvas.height = height;
		}
	}

	function onTouchMove(e) {
		if (e.touches.length > 0) {
			for (let i = 0; i < e.touches.length; i++) {
				addParticle(e.touches[i].clientX, e.touches[i].clientY, baseImage);
			}
		}
	}

	function onMouseMove(e) {
		if (hasWrapperEl) {
			const boundingRect = element.getBoundingClientRect();
			cursor.x = e.clientX - boundingRect.left;
			cursor.y = e.clientY - boundingRect.top;
		} else {
			cursor.x = e.clientX;
			cursor.y = e.clientY;
		}

		addParticle(cursor.x, cursor.y, baseImage);
	}

	function addParticle(x, y, image) {
		particles.push(new Particle(x, y, image));
	}

	function updateParticles() {
		context.clearRect(0, 0, width, height);

		// Update
		for (let i = 0; i < particles.length; i++) {
			particles[i].update(context);
		}

		// Remove dead particles
		for (let i = particles.length - 1; i >= 0; i--) {
			if (particles[i].lifeSpan < 0) {
				particles.splice(i, 1);
			}
		}
	}

	function loop() {
		updateParticles();
		requestAnimationFrame(loop);
	}

	/**
   * Particles
   */

	function Particle(x, y, image) {
		const lifeSpan = 40;
		this.initialLifeSpan = lifeSpan; //ms
		this.lifeSpan = lifeSpan; //ms
		this.position = { x: x, y: y };

		this.image = image;

		this.update = function(context) {
			this.lifeSpan--;
			const opacity = Math.max(this.lifeSpan / this.initialLifeSpan, 0);

			context.globalAlpha = opacity;
			context.drawImage(
				this.image,
				this.position.x, // - (this.canv.width / 2) * scale,
				this.position.y //- this.canv.height / 2,
			);
		};
	}

	init();
}
