let rotatingCursor = (function() {
	/* Local Variables */
	const INTERVAL_POSITION = 5;
	const INTERVAL_ROTATION = 100;
	let lastCursorPos = { x: -999, y: -999 };
	let currentCursorPos = { x: -999, y: -999 };
	let lastCursorAngle = 0,
		cursorAngle = 0;
	let cursorEl, cursorImageEl;

	/* Local Functions */

	// NOTE: I am transform two different elements here because so I can only animate the rotation with 'transition-property: transform'.
	function setCurrentCursorProps() {
		// Apply translation (set to actual cursor position)
		cursorEl.style.transform = `translate(${currentCursorPos.x}px, ${currentCursorPos.y}px)`;

		// Ensure correct rotation transition direction
		while (Math.abs(lastCursorAngle - cursorAngle) > 180) {
			if (cursorAngle > lastCursorAngle) {
				cursorAngle -= 360;
			} else if (cursorAngle < lastCursorAngle) {
				cursorAngle += 360;
			}
		}
		// Apply rotation
		cursorImageEl.style.transform = `rotate(${cursorAngle - 90}deg)`;
	}

	function updateCursor() {
		window.addEventListener('mousemove', (event) => {
			currentCursorPos = { x: event.clientX, y: event.clientY };
		});

		// Interval for updating cursor-position
		setInterval(setCurrentCursorProps, INTERVAL_POSITION);

		// Interval for updating cursor-rotation
		setInterval(() => {
			const delt = {
				x: lastCursorPos.x - currentCursorPos.x,
				y: lastCursorPos.y - currentCursorPos.y
			};

			if (Math.abs(delt.x) < 3 && Math.abs(delt.y) < 3) return;
			cursorAngle = Math.atan2(delt.y, delt.x) * 180 / Math.PI;

			setCurrentCursorProps();

			lastCursorPos = currentCursorPos;
			lastCursorAngle = cursorAngle;
		}, INTERVAL_ROTATION);
	}

	/* Public Functions */

	return {
		initialize: () => {
			cursorEl = document.querySelector('#cursor');
			cursorImageEl = document.querySelector('#cursor > img');
			updateCursor();
		}
	};
})();

document.addEventListener('DOMContentLoaded', rotatingCursor.initialize);

// trail

let dots = [],
	mouse = {
		x: 0,
		y: 0
	};
// let mouseEl = document.getElementById('cursor');

// The Dot object used to scaffold the dots
var Dot = function() {
	this.x = 0;
	this.y = 0;
	this.node = (function() {
		var n = document.createElement('div');
		n.className = 'trail';
		mouseEl.appendChild(n);
		// document.body.appendChild(n);
		return n;
	})();
};
// The Dot.prototype.draw() method sets the position of
// the object's <div> node
Dot.prototype.draw = function() {
	this.node.style.left = this.x + 'px';
	this.node.style.top = this.y + 'px';
};

// Creates the Dot objects, populates the dots array
for (var i = 0; i < 12; i++) {
	var d = new Dot();
	dots.push(d);
}

// This is the screen redraw function
function draw() {
	// Make sure the mouse position is set everytime
	// draw() is called.
	var x = mouse.x,
		y = mouse.y;

	// This loop is where all the 90s magic happens
	dots.forEach(function(dot, index, dots) {
		var nextDot = dots[index + 1] || dots[0];

		dot.x = x;
		dot.y = y;
		dot.draw();
		// console.log(nextDot.x, dot.x);
		x += (nextDot.x - dot.x) * 0.6;
		y += (nextDot.y - dot.y) * 0.6;
	});
}

// addEventListener('mousemove', function(event) {
// 	//event.preventDefault();
// 	// get pos of #cursor
// 	let foo = offset(mouseEl);
// 	// [ mouse.x, mouse.y ] = offset(mouseEl);
// 	mouse.x = event.pageX - foo[0];
// 	console.log(event.pageX, foo[0]);
// 	// mouse.x = event.pageX;
// 	mouse.y = event.pageY - foo[1];
// 	// mouse.y = event.pageY;
// });

// animate() calls draw() then recursively calls itself
// everytime the screen repaints via requestAnimationFrame().
function animate() {
	draw();
	requestAnimationFrame(animate);
}

animate();

function offset(el) {
	let rect = el.getBoundingClientRect();
	return [ rect.x, rect.y ];
}
