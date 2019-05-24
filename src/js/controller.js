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
let currentlyViewedCharakter = 'egyptian';

airConsole.onReady = function() {
	const name = document.getElementsByClassName('waiting__name')[0];
	name.innerText = 'You are ' + airConsole.getNickname();
};

function handleWaiting(data) {
	switch (data.action) {
	case 'touch_to_continue':
		const waiting = document.getElementById('state--waiting');

		waiting.addEventListener('touchstart', function() {
			airConsole.message(AirConsole.SCREEN,
				{
					screen: 'waiting',
					action: 'start_character_selection'
				});
		});
		break;
	case 'characterSelection':
		csm.startState('characterSelection');
		setUpCharacterSelection();
		break;
	case 'get_id':
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
		checkIfSkinTaken(false, data.selectedCharacterIndex)
		break;
	case 'deselected_character':
		takenSkins.delete(data.selectedCharacterIndex);
		checkIfSkinTaken(false, data.selectedCharacterIndex, data.selectedCharacter);
		break;
	case 'all_characters_selected': 
		removeDeselectButton();
		break;
	default:
	}
}

function handleEmotes(data) {
	switch (data.action) {
	case 'new_game_button': 
		changeToRestartButton();
		break;
	case 'change_to_controller':
		csm.startState('game');
		setUpController();
		break;
	case 'characterSelection':
		csm.startState('characterSelection');
		setUpCharacterSelection();
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

function sendToScreen(data) {
	airConsole.message(AirConsole.SCREEN, data);
}

function setUpController() {
	const buttons = document.getElementsByClassName('button');

	for (const button of buttons) {
		if(button.dataset.direction !== 'shoot') {
			button.addEventListener('touchstart', function(e) {
				sendToScreen({action: e.currentTarget.dataset.direction});
				button.classList.add('button--active');
			}, {passive: true});
			button.addEventListener('touchend', function(e) {
				if (button.dataset.direction === 'right' || button.dataset.direction === 'left') {
					sendToScreen({action: 'idle'});
				}
				button.classList.remove('button--active');
			});
		}
	}

	const directionButtons = document.getElementsByClassName('controller__buttons__direction')[0];
	const actionButtons = document.getElementsByClassName('button__wrapper')[0];
	const controller = document.getElementsByClassName('controller')[0];
	const buttonLeft = document.getElementsByClassName('button--left')[0];
	const buttonRight = document.getElementsByClassName('button--right')[0];
	const buttonShoot = document.getElementsByClassName('button--shoot')[0];
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
			sendToScreen({action: currentTarget.dataset.direction});
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
				sendToScreen({action: direction});
				cnt = 0;
			}
		};
	}();

	buttonRight.addEventListener('touchstart', function(e) {
		doubleTap('dashRight');
	});

	buttonLeft.addEventListener('touchstart', function(e) {
		doubleTap('dashLeft');
	});
	
	let startTime;
	let endTime;

	function prepareShoot() {
		startTime = new Date();
		buttonShoot.classList.add('button--active');
	}

	function launchShoot() {
		endTime = new Date();
	  let shootTime = endTime - startTime;
	  sendToScreen({action: buttonShoot.dataset.direction, shootTime: shootTime});
	  buttonShoot.classList.remove('button--active');
	}

	buttonShoot.addEventListener('touchstart', prepareShoot);
	buttonShoot.addEventListener('touchend', launchShoot);
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

	document.querySelector('#button__select_left').addEventListener('touchstart', (e) => {
		// prev
		characters[index].id = '';
		characters[index].classList.add('character--invisible');
		index = (((index - 1) % (characters.length)) + (characters.length)) % (characters.length);
		checkIfSkinTaken(true, index);
		characters[index].classList.remove('character--invisible');
		characters[index].id = 'character--selected';
		name.innerText = characters[index].dataset.name;
		currentlyViewedCharakter = characters[index].dataset.character;
	});
	document.querySelector('#button__select_right').addEventListener('touchstart', () => {
		// next
		characters[index].classList.add('character--invisible');
		characters[index].id = '';
		index = (((index + 1) % (characters.length)) + (characters.length)) % (characters.length);
		checkIfSkinTaken(true, index);
		characters[index].classList.remove('character--invisible');
		characters[index].id = 'character--selected';
		name.innerText = characters[index].dataset.name;
		currentlyViewedCharakter = characters[index].dataset.character;
	});

	document.querySelector('#button__select').addEventListener('touchstart', (e) => {
		if(selectedCharacter === '') {
			airConsole.message(AirConsole.SCREEN, {
				screen: 'character_selection',
				action: 'character_selected',
				selectedCharacter: document.getElementById('character--selected').dataset.character,
				selectedCharacterIndex: index
			});
			selectedCharacter = document.getElementById('character--selected').dataset.character;
			e.currentTarget.innerHTML = "DESELECT";
			document.getElementById('button__select_left').style.opacity = 0;
			document.getElementById('button__select_right').style.opacity = 0;
		}
		else {
			airConsole.message(AirConsole.SCREEN, {
				screen: 'character_selection',
				action: 'character_deselected',
				selectedCharacter: document.getElementById('character--selected').dataset.character,
				selectedCharacterIndex: index
			});
			selectedCharacter = '';
			e.currentTarget.innerHTML = "SELECT";
			document.getElementById('button__select_left').style.opacity = 1;
			document.getElementById('button__select_right').style.opacity = 1;
		}
	});
}

function checkIfSkinTaken(arrowKey, index, skinDeselect) {
	const skin = takenSkins.get(index);
	if(skin) {
		if(selectedCharacter !== '') {
			document.getElementById('button__select').classList.remove('selection__character_inactive');
			document.getElementsByClassName(skin)[0].classList.remove('selection__character_inactive');
		}
		if(selectedCharacter === '') {
			if(skin === currentlyViewedCharakter || arrowKey) {
				document.getElementById('button__select').classList.add('selection__character_inactive');
			}
			document.getElementsByClassName(skin)[0].classList.add('selection__character_inactive');
		}
	}
	else {
		document.getElementById('button__select').classList.remove('selection__character_inactive');
	}
	if(skinDeselect) {
		document.getElementsByClassName(skinDeselect)[0].classList.remove('selection__character_inactive');
		document.getElementById('button__select').classList.remove('selection__character_inactive');
	}
}

function removeDeselectButton() {
	document.getElementById('button__select').style.display = 'none';
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

function changeToRestartButton() {
	document.getElementById('button__score__ready').innerHTML = 'New Game';
}
