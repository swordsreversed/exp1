let rotatingCursor = (function() {
	/* Local Variables */
	const INTERVAL_POSITION = 5;
	const INTERVAL_ROTATION = 100;
	let lastCursorPos = { x: -999, y: -999 };
	let currentCursorPos = { x: -999, y: -999 };
	let lastCursorAngle = 0,
		cursorAngle = 0;
	let cursorEl, cursorImageEl, h, wintimer;

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
		// Add trail
		var elem = document.createElement('div');
		var size = 3 + 'px';
		elem.style.position = 'fixed';
		elem.style.zIndex = 10001;
		elem.style.top = currentCursorPos.y + 'px';
		elem.style.left = currentCursorPos.x + 'px';
		elem.style.width = size;
		elem.style.height = size;
		elem.style.background = '#000';

		elem.style.pointerEvents = 'none';

		document.body.appendChild(elem);
		if (h == 0) {
			wintimer = 400;
			h = 1;
		} else {
			h = 0;
			wintimer = 500;
		}
		window.setTimeout(function() {
			document.body.removeChild(elem);
		}, wintimer);
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

/*let dots = [],
	mouse = {
		x: 0,
		y: 0
	};
let mouseEl = document.getElementById('cursor');

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

addEventListener('mousemove', function(event) {
	event.preventDefault();
	// 	// get pos of #cursor
	// 	let foo = offset(mouseEl);
	// 	// [ mouse.x, mouse.y ] = offset(mouseEl);
	// 	mouse.x = event.pageX - foo[0];
	// 	console.log(event.pageX, foo[0]);
	// 	// mouse.x = event.pageX;
	// 	mouse.y = event.pageY - foo[1];
	// 	// mouse.y = event.pageY;
	let cp = $('#cursor').position();
	mouse.x = cp.left;
	mouse.y = cp.top;
});

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
*/

// window.addEventListener(
// 	'mousemove',
// 	function(e) {
// 		[ 1, 0.9, 0.8, 0.5, 0.1 ].forEach(function(i) {
// 			var j = (1 - i) * 50;
// 			var elem = document.createElement('div');
// 			var size = Math.ceil(Math.random() * 10 * i) + 'px';
// 			elem.style.position = 'fixed';
// 			elem.style.top = e.pageY + Math.round(Math.random() * j - j / 2) + 'px';
// 			elem.style.left = e.pageX + Math.round(Math.random() * j - j / 2) + 'px';
// 			elem.style.width = size;
// 			elem.style.height = size;
// 			elem.style.background = 'hsla(' + Math.round(Math.random() * 360) + ', ' + '100%, ' + '50%, ' + i + ')';
// 			elem.style.borderRadius = size;
// 			elem.style.pointerEvents = 'none';
// 			document.body.appendChild(elem);
// 			window.setTimeout(function() {
// 				document.body.removeChild(elem);
// 			}, Math.round(Math.random() * i * 500));
// 		});
// 	},
// 	false
// );

// d3
/*
var npoints = 25;
var ptdata = [];
var line = d3
	.line()
	.x(function(d, i) {
		return d[0];
	})
	.y(function(d, i) {
		return d[1];
	})
	.curve(d3.curveBasis);

var svg = d3.select('body').append('svg').attr('class', 'dashedsvg').append('g');
var svgagain = d3.select('body').select('.dashedsvg').on('mousemove', function(e) {
	var pt = d3.pointer(e);
	tick(pt);
});

var path = svg.append('g').append('path').data([ ptdata ]).attr('class', 'dashedline').attr('d', line);

function tick(pt) {
	// push a new data point onto the back
	ptdata.push(pt);

	// Redraw the path:
	path.attr('d', function(d) {
		return line(d);
	});

	// If more than 100 points, drop the old data pt off the front
	if (ptdata.length > npoints) {
		ptdata.shift();
	}
}
*/
