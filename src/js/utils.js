export function isTouchDevice() {
	try {
		document.createEvent('TouchEvent');
		return true;
	}
	catch (e) {
		return false;
	}
}

export function addImage(game, x, y, name, width, height) {
	const bg = game.add.image(x, y, name);

	bg.width = width;
	bg.height = height;
	return bg;
}
