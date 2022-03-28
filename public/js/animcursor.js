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
		var size = 5 + 'px';
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
