import '../scss/style.scss';
import CSM from './ControllerStateManager';

const airConsole = new AirConsole({'orientation': 'landscape'});
const csm = new CSM('stage');

csm.setState('waiting', 'state--waiting');
csm.setState('character_selection', 'state--character_selection');
csm.setState('emotes', 'state--emotes');
csm.setState('game', 'state--game');
csm.setState('winning', 'state--winning');
csm.setState('loosing', 'state--loosing');
csm.setState('too-many-players', 'state--too-many-players');
csm.startState('waiting');

let takenSkins = [];
let selectedCharacter = '';
let currentlyViewedCharakter = 'egyptian';

const clickSound = new Audio('./assets/audio/extras/click.wav');
const selectSound = new Audio('./assets/audio/player/collected_soul.wav');
const trumpetsSound = new Audio('./assets/audio/extras/trumpets.wav');

airConsole.onReady = function() {
	const name = document.getElementsByClassName('waiting__info')[0];

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
		csm.startState('too-many-players');
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
		csm.startState('character_selection');
		setUpCharacterSelection();
		break;
	default:
	}
}

function handleGame(data) {
	switch (data.action) {
	case 'winning':
		trumpetsSound.play();
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
	case 'reconnected':
		csm.startState('game');
		setUpController();
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
		checkIfSkinTaken(data.selectedCharacter);
		break;
	case 'deselected_character':
		takenSkins.splice(takenSkins.indexOf(data.selectedCharacter), 1);
		checkIfSkinTaken(data.selectedCharacter);
		break;
	case 'reconnected':
		takenSkins = data.skins;
		selectedCharacter = '';
		csm.startState('character_selection');
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
	case 'new_game_button':
		changeToRestartButton();
		break;
	case 'change_to_controller':
		csm.startState('game');
		setUpController();
		break;
	case 'characterSelection':
		takenSkins = [];
		selectedCharacter = '';
		csm.startState('character_selection');
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
	const directionButtons = document.getElementsByClassName('controller__direction')[0];
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

		if(previousTarget !== currentTarget) {
			if(previousTarget === buttonRight) {
				buttonRight.classList.remove('button__right--active');
			}
			else if(previousTarget === buttonLeft) {
				buttonLeft.classList.remove('button__left--active');
			}
			else if(previousTarget === buttonJump) {
				buttonJump.classList.remove('button__jump--active');
			}
			else if(previousTarget === buttonShoot) {
				buttonShoot.classList.remove('button__shoot--active');
			}

			if(currentTarget === buttonRight) {
				buttonRight.classList.add('button__right--active');
			}
			else if(currentTarget === buttonLeft) {
				buttonLeft.classList.add('button__left--active');
			}
			else if(currentTarget === buttonJump) {
				buttonJump.classList.add('button__jump--active');
			}
			else if(currentTarget === buttonShoot) {
				buttonShoot.classList.add('button__shoot--active');
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
		buttonShoot.classList.add('button__shoot--active');
		startTime = new Date();
		buttonShoot.classList.add('button--active');
	}

	function launchShoot() {
		buttonShoot.classList.remove('button__shoot--active');
		endTime = new Date();
		const shootTime = endTime - startTime;

		sendToScreen({action: buttonShoot.dataset.direction, shootTime: shootTime});
		buttonShoot.classList.remove('button--active');
	}

	buttonShoot.addEventListener('touchstart', prepareShoot);
	buttonShoot.addEventListener('touchend', launchShoot);

	buttonJump.addEventListener('touchstart', function(event) {
		buttonJump.classList.add('button__jump--active');
		sendToScreen({action: buttonJump.dataset.direction});
		buttonJump.classList.add('button--active');
	}, {passive: true});
	buttonJump.addEventListener('touchend', function(event) {
		buttonJump.classList.remove('button__jump--active');
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

	document.querySelector('#selection__button--left').addEventListener('touchstart', (e) => {
		clickSound.play();
		// prev
		characters[index].id = '';
		characters[index].classList.add('character--invisible');
		index = (((index - 1) % (characters.length)) + (characters.length)) % (characters.length);

		currentlyViewedCharakter = characters[index].dataset.character;
		checkIfSkinTaken(characters[index].dataset.character);

		characters[index].classList.remove('character--invisible');
		characters[index].id = 'character--selected';
		name.innerText = characters[index].dataset.name;
	});
	document.querySelector('#selection__button--right').addEventListener('touchstart', (e) => {
		clickSound.play();
		// next
		characters[index].classList.add('character--invisible');
		characters[index].id = '';
		index = (((index + 1) % (characters.length)) + (characters.length)) % (characters.length);

		currentlyViewedCharakter = characters[index].dataset.character;
		checkIfSkinTaken(characters[index].dataset.character);

		characters[index].classList.remove('character--invisible');
		characters[index].id = 'character--selected';
		name.innerText = characters[index].dataset.name;
	});

	document.querySelector('#button--select').addEventListener('touchstart', (e) => {
		selectSound.play();
		if(selectedCharacter === '') {
			airConsole.message(AirConsole.SCREEN, {
				screen: 'character_selection',
				action: 'character_selected',
				selectedCharacter: document.getElementById('character--selected').dataset.character
			});
			selectedCharacter = document.getElementById('character--selected').dataset.character;
			e.currentTarget.innerHTML = 'DESELECT';
			document.getElementById('selection__button--left').classList.add('button--invisible');
			document.getElementById('selection__button--right').classList.add('button--invisible');
		}
		else {
			airConsole.message(AirConsole.SCREEN, {
				screen: 'character_selection',
				action: 'character_deselected',
				selectedCharacter: document.getElementById('character--selected').dataset.character
			});
			selectedCharacter = '';
			e.currentTarget.innerHTML = 'SELECT';
			document.getElementById('selection__button--left').classList.remove('button--invisible');
			document.getElementById('selection__button--right').classList.remove('button--invisible');
		}
	});
}

function checkIfSkinTaken(skinName) {
	console.log(takenSkins)
	if(selectedCharacter !== '') {
		document.getElementById('button--select').classList.remove('selection__character_inactive');
		document.getElementsByClassName(skinName)[0].classList.remove('selection__character_inactive');
	}
	else {
		if(takenSkins.includes(currentlyViewedCharakter)) {
			document.getElementById('button--select').classList.add('selection__character_inactive');
			document.getElementsByClassName(skinName)[0].classList.add('selection__character_inactive');
		}
		else {
			document.getElementById('button--select').classList.remove('selection__character_inactive');
			document.getElementsByClassName(skinName)[0].classList.remove('selection__character_inactive');
		}
	}
}

function removeDeselectButton() {
	document.getElementById('button--select').style.display = 'none';
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
		const readyButton = document.getElementById('button__score__ready');

		readyButton.classList.add('button--visible');
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
