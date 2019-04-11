import {isTouchDevice} from './utils';
import CSM from './controllerStateManager';

let airConsole = new AirConsole({"orientation": "landscape"});

let csm = new CSM('stage');

csm.setState('waiting', 'state--waiting');
csm.setState('characterSelection', 'state--character_selection')
csm.setState('game', 'state--game');
csm.setState('winning', 'state--winning');
csm.setState('loosing', 'state--loosing');

csm.startState('characterSelection');

airConsole.onReady = function() {
  let name = document.getElementsByClassName('waiting__name')[0];
  name.innerText = "You are " + airConsole.getNickname();
}

function handleWaiting(data){
  switch (data.action) {
    case 'touch_to_continue':
      let waiting = document.getElementById('state--waiting');
      waiting.addEventListener('touchstart', function(){
        airConsole.message(AirConsole.SCREEN,
          {
            screen: 'waiting',
            action: 'start_character_selection'
          });
      })
      break;
    case 'change_to_controller':
      csm.startState('game');
      setUpController();
      break;
    case 'characterSelection':
      csm.startState('characterSelection');
      setUpCharacterSelection();
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
  }
}

function sendToScreen(action) {
  airConsole.message(AirConsole.SCREEN, {action: action});
}

function setUpController(){
  let buttons = document.getElementsByClassName('button');

  if (isTouchDevice) {
    for (let button of buttons) {
      button.addEventListener("touchstart", function(e){
        sendToScreen(e.currentTarget.dataset.direction);
        button.classList.add('button--active');
      },{passive: true});

      button.addEventListener("touchend", function(e){
        if (button.dataset.direction === 'right' || button.dataset.direction === 'left') {
          sendToScreen('idle');
        }
        button.classList.remove('button--active');
      });
    }
  }
  else {
    for (let button of buttons) {
      button.addEventListener("mousedown", function(e){
        sendToScreen(e.currentTarget.dataset.direction);
        button.classList.add('button--active');
      },{passive: true});

      button.addEventListener("mouseup", function(e){
        if (button.dataset.direction === 'right' || button.dataset.direction === 'left') {
          sendToScreen('idle');
        }
        button.classList.remove('button--active');
      });
    }
  }
}

function setUpCharacterSelection() {

  airConsole.message(AirConsole.SCREEN,
    {
      screen: 'character_selection',
      action: 'character_selected',
      selectedCharacter: 'egyptian'
    });
}
