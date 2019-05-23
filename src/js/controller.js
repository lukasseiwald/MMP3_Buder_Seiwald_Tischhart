import '../scss/style.scss';
import CSM from './ControllerStateManager';

const airConsole = new AirConsole({'orientation': 'landscape'});
const csm = new CSM('stage');

csm.setState('waiting', 'state--waiting');
csm.setState('characterSelection', 'state--character_selection');
csm.setState('emotes', 'state--emotes');
csm.setState('game', 'state--game');
csm.setState('winning', 'state--winning');
csm.setState('loosing', 'state--loosing');
csm.startState('waiting');

const takenSkins = new Map();
let selectedCharacter = '';

airConsole.onReady = function() {
	const name = document.getElementsByClassName('waiting__name')[0];

	name.innerText = 'You are ' + airConsole.getNickname();
};

function changeScreenToCharacterSelection() {
	airConsole.message(AirConsole.SCREEN,
		{
			screen: 'waiting',
			action: 'start_character_selection'
		});
}

function handleWaiting(data) {
	const waiting = document.getElementById('state--waiting');

	switch (data.action) {
	case 'touch_to_continue':
		waiting.addEventListener('touchstart', changeScreenToCharacterSelection);
		break;
	case 'touch_to_continue_abort':
		waiting.removeEventListener('touchstart', changeScreenToCharacterSelection);
		break;
	case 'characterSelection':
		csm.startState('characterSelection');
		setUpCharacterSelection();
		break;
	default:
	}
}

function handleGame(data) {
	switch (data.action) {
	case 'winning':
		csm.startState('winning');
		break;
	case 'loosing':
		csm.startState('loosing');
		break;
	case 'restart':
		csm.startState('game');
		break;
	case 'emotes':
		csm.startState('emotes');
		setUpEmotes();
		break;
	default:
	}
}

function handleCharacterSelection(data) {
	switch (data.action) {
	case 'change_to_controller':
		csm.startState('game');
		setUpController();
		break;
	case 'selected_character':
		takenSkins.set(data.selectedCharacterIndex, data.selectedCharacter);
		if(selectedCharacter !== data.selectedCharacter) {
			document.getElementsByClassName(data.selectedCharacter)[0].classList.add('selection__character_inactive');
			document.getElementById('button__select').classList.add('selection__character_inactive');
		}
		break;
	case 'reconnected':
		csm.startState('characterSelection');
		setUpCharacterSelection();
	default:
	}
}

function handleEmotes(data) {
	switch (data.action) {
	case 'change_to_controller':
		csm.startState('game');
		setUpController();
		break;
	default:
	}
}

airConsole.onMessage = function(from, data) {
	switch (data.screen) {
	case 'waiting':
		handleWaiting(data);
		break;
	case 'game':
		handleGame(data);
		break;
	case 'characterSelection':
		handleCharacterSelection(data);
		break;
	case 'emotes':
		handleEmotes(data);
		break;
	default:
	}
};

function sendToScreen(action) {
	airConsole.message(AirConsole.SCREEN, {action: action});
}

function setUpController() {
	const buttons = document.getElementsByClassName('button');

	for (const button of buttons) {
		button.addEventListener('touchstart', function(e) {
			sendToScreen(e.currentTarget.dataset.direction);
			button.classList.add('button--active');
		}, {passive: true});
		button.addEventListener('touchend', function(e) {
			if (button.dataset.direction === 'right' || button.dataset.direction === 'left') {
				sendToScreen('idle');
			}
			button.classList.remove('button--active');
		});
	}

	const directionButtons = document.getElementsByClassName('controller__buttons__direction')[0];
	const actionButtons = document.getElementsByClassName('button__wrapper')[0];
	const controller = document.getElementsByClassName('controller')[0];
	const buttonLeft = document.getElementsByClassName('button--left')[0];
	const buttonRight = document.getElementsByClassName('button--right')[0];
	let previousTarget;

	directionButtons.addEventListener('touchmove', function(event) {
		const touch = event.touches[0];
		const coordX = touch.pageX;
		const coordY = touch.pageY;
		const currentTarget = document.elementFromPoint(coordX, coordY);

		if(previousTarget !== currentTarget) {
			previousTarget && previousTarget.classList.remove('button--active');
			currentTarget.classList.add('button--active');
			previousTarget = currentTarget;
			sendToScreen(currentTarget.dataset.direction);
		}
	});
	controller.addEventListener('touchend', function(event) {
		for(const button of buttons) {
			button.classList.remove('button--active');
		}
	});

	const doubleTap = function(direction) {
		let cnt = 0;

		return function(direction) {
			cnt += 1;
			setTimeout(function() {
				cnt += 1;
				if(cnt < 0) {
					cnt = 0;
				}
			}, 200);
			if(cnt === 2) {
				sendToScreen(direction);
				cnt = 0;
			}
		};
	}();

	buttonRight.addEventListener('touchstart', function() {
		doubleTap('dashRight');
	});

	buttonLeft.addEventListener('touchstart', function() {
		doubleTap('dashLeft');
	});
}

function setUpCharacterSelection() {
	const deviceId = airConsole.getDeviceId();
	const test = document.getElementsByClassName(airConsole.getDeviceId())[0];
	const characters = document.getElementsByClassName('character');
	const name = document.getElementById('name');
	let index = 0;

	document.getElementById('stage').classList.add(deviceId);
	characters[0].classList.remove('character--invisible');
	characters[0].id = 'character--selected';
	name.innerText = characters[0].dataset.name;

	function checkIfSkinTaken(index) {
		const skin = takenSkins.get(index);

		if(skin) {
			document.getElementsByClassName(skin)[0].classList.add('selection__character_inactive');
			document.getElementById('button__select').classList.add('selection__character_inactive');
		}
		else {
			document.getElementById('button__select').classList.remove('selection__character_inactive');
		}
	}

	document.querySelector('#button__select_left').addEventListener('touchstart', (e) => {
		// prev
		characters[index].id = '';
		characters[index].classList.add('character--invisible');
		index = (((index - 1) % (characters.length)) + (characters.length)) % (characters.length);
		checkIfSkinTaken(index);
		characters[index].classList.remove('character--invisible');
		characters[index].id = 'character--selected';
		name.innerText = characters[index].dataset.name;
	});
	document.querySelector('#button__select_right').addEventListener('touchstart', () => {
		// next
		characters[index].classList.add('character--invisible');
		characters[index].id = '';
		index = (((index + 1) % (characters.length)) + (characters.length)) % (characters.length);
		checkIfSkinTaken(index);
		characters[index].classList.remove('character--invisible');
		characters[index].id = 'character--selected';
		name.innerText = characters[index].dataset.name;
	});

	document.querySelector('#button__select').addEventListener('touchstart', (e) => {
		airConsole.message(AirConsole.SCREEN, {
			screen: 'character_selection',
			action: 'character_selected',
			selectedCharacter: document.getElementById('character--selected').dataset.character,
			selectedCharacterIndex: index
		});
		selectedCharacter = document.getElementById('character--selected').dataset.character;
		e.currentTarget.remove();
		document.getElementById('button__select_left').style.opacity = 0;
		document.getElementById('button__select_right').style.opacity = 0;
	});
}

function setUpEmotes() {
	const buttons = document.getElementsByClassName('emote__button');

	for(const button of buttons) {
		button.addEventListener('touchstart', function(e) {
			const emoteType = button.dataset.emote;

			airConsole.message(AirConsole.SCREEN, {
				screen: 'emotes',
				emote: emoteType
			});
			button.classList.add('button--active');
		}, {passive: true});
		button.addEventListener('touchend', function(e) {
			button.classList.remove('button--active');
		});
	}

	// Ready Button Only For Master
	const deviceId = airConsole.getDeviceId();
	const masterId = airConsole.getMasterControllerDeviceId();

	if(deviceId === masterId) {
		document.getElementById('score__ready__wrapper').style.display = 'flex';

		const readyButton = document.getElementById('button__score__ready');

		readyButton.addEventListener('touchstart', function(e) {
			airConsole.message(AirConsole.SCREEN, {
				screen: 'emotes',
				ready: true
			});
			readyButton.classList.add('button--active');
		});
	}
}
