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
csm.setState('tooManyPlayers', 'state--too-many-players');
csm.startState('waiting');

let takenSkins = [];
let selectedCharacter = '';
let currentlyViewedCharakter = 'egyptian';

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

function handleDefaults(data) {
	switch (data.action) {
	case 'too_many_players':
		csm.startState('tooManyPlayers');
		break;
	default:
	}
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
		takenSkins.push(data.selectedCharacter);
		checkIfSkinTaken(false, data.selectedCharacter);
		break;
	case 'deselected_character':
		takenSkins.splice(takenSkins.indexOf(data.selectedCharacter, 1));
		checkIfSkinTaken(false, data.selectedCharacter, true);
		break;
	case 'reconnected':
		takenSkins = data.skins;
		csm.startState('characterSelection');
		setUpCharacterSelection();
		break;
	case 'all_characters_selected':
		removeDeselectButton();
		break;
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
	case 'defaults':
		handleDefaults(data);
		break;
	default:
	}
};

function sendToScreen(data) {
	airConsole.message(AirConsole.SCREEN, data);
}

function setUpController() {
	const directionButtons = document.getElementsByClassName('controller__buttons__direction')[0];
	const controller = document.getElementsByClassName('controller')[0];
	const buttonLeft = document.getElementsByClassName('button--left')[0];
	const buttonRight = document.getElementsByClassName('button--right')[0];
	const buttonShoot = document.getElementsByClassName('button--shoot')[0];
	const buttonJump = document.getElementsByClassName('button--jump')[0];
	let previousTarget;

	buttonRight.addEventListener('touchstart', function(event) {
		sendToScreen({action: buttonRight.dataset.direction});
		buttonRight.classList.add('button__right--active');
	}, {passive: true});
	buttonRight.addEventListener('touchend', function(event) {
		sendToScreen({action: 'idle'});
		buttonRight.classList.remove('button__right--active');
	}, {passive: true});

	buttonLeft.addEventListener('touchstart', function(event) {
		sendToScreen({action: buttonLeft.dataset.direction});
		buttonLeft.classList.add('button__left--active');
	}, {passive: true});
	buttonLeft.addEventListener('touchend', function(event) {
		sendToScreen({action: 'idle'});
		buttonLeft.classList.remove('button__left--active');
	}, {passive: true});

	directionButtons.addEventListener('touchmove', function(event) {
		const touch = event.touches[0];
		const coordX = touch.pageX;
		const coordY = touch.pageY;
		const currentTarget = document.elementFromPoint(coordX, coordY);
		console.log("coords: " + coordX + " " + coordY)
		console.log("element: ", currentTarget)

		if(previousTarget !== currentTarget) {
			if(previousTarget === buttonRight) {
				buttonRight.classList.remove('button__right--active')
			}
			else if(previousTarget === buttonLeft) {
				buttonLeft.classList.remove('button__left--active')
			}
			else {
				previousTarget && previousTarget.classList.remove('button--active');
			}

			if(currentTarget === buttonRight) {
				buttonRight.classList.add('button__right--active')
			}
			else if(currentTarget === buttonLeft) {
				buttonLeft.classList.add('button__left--active')
			}
			else {
				currentTarget.classList.add('button--active');
			}
			previousTarget = currentTarget;
			sendToScreen({action: currentTarget.dataset.direction});
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
	}, {passive: true});

	buttonLeft.addEventListener('touchstart', function(e) {
		doubleTap('dashLeft');
	}, {passive: true});

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

	buttonJump.addEventListener('touchstart', function(event) {
		sendToScreen({action: buttonJump.dataset.direction});
		buttonJump.classList.add('button--active');
	}, {passive: true});
	buttonJump.addEventListener('touchend', function(event) {
		buttonJump.classList.remove('button--active');
	}, {passive: true});
}

function setUpCharacterSelection() {
	const deviceId = airConsole.getDeviceId();
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

		checkIfSkinTaken(true, characters[index].dataset.character);

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

		checkIfSkinTaken(true, characters[index].dataset.character);

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
				selectedCharacter: document.getElementById('character--selected').dataset.character
			});
			selectedCharacter = document.getElementById('character--selected').dataset.character;
			e.currentTarget.innerHTML = 'DESELECT';
			document.getElementById('button__select_left').classList.add('button__select--invisible');
			document.getElementById('button__select_right').classList.add('button__select--invisible');
		}
		else {
			airConsole.message(AirConsole.SCREEN, {
				screen: 'character_selection',
				action: 'character_deselected',
				selectedCharacter: document.getElementById('character--selected').dataset.character
			});
			selectedCharacter = '';
			e.currentTarget.innerHTML = 'SELECT';
			document.getElementById('button__select_left').classList.remove('button__select--invisible');
			document.getElementById('button__select_right').classList.remove('button__select--invisible');
		}
	});
}

function checkIfSkinTaken(arrowKey, skinName, skinDeselect) {
	if (takenSkins.includes(skinName)) {
		if(selectedCharacter !== '') {
			document.getElementById('button__select').classList.remove('selection__character_inactive');
			document.getElementsByClassName(skinName)[0].classList.remove('selection__character_inactive');
		}
		else {
			if(skinName === currentlyViewedCharakter || arrowKey) {
				document.getElementById('button__select').classList.add('selection__character_inactive');
			}
			document.getElementsByClassName(skinName)[0].classList.add('selection__character_inactive');
		}
	}
	else {
		document.getElementById('button__select').classList.remove('selection__character_inactive');
	}

	if(skinDeselect) {
		document.getElementsByClassName(skinName)[0].classList.remove('selection__character_inactive');
		document.getElementById('button__select').classList.remove('selection__character_inactive');
	}
}

function removeDeselectButton() {
	document.getElementById('button__select').remove();
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
