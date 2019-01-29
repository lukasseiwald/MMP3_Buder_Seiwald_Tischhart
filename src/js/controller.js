import {isTouchDevice} from './utils';
import CSM from './controllerStateManager';

let airConsole = new AirConsole({"orientation": "landscape"});

let csm = new CSM('stage');

csm.setState('waiting', 'state--waiting');
csm.setState('game', 'state--game');
csm.startState('waiting');

airConsole.onReady = function() {
  let name = document.getElementsByClassName('player--name')[0];
  name.innerText = "You are " + airConsole.getNickname();
}

airConsole.onMessage = function(from, data) {
  if (data === 'test') {
    csm.startState('game');
    setUpController();
  }
}

function sendToScreen(action) {
  airConsole.message(AirConsole.SCREEN, {action: action});
}

function setUpController(){
  let buttons = document.getElementsByClassName('button');
  if (isTouchDevice()) {
    for (let button of buttons) {
      button.addEventListener("touchstart", function(e){
        sendToScreen(e.currentTarget.dataset.direction);
      },{passive: true});
      button.addEventListener("touchend", function(e){
        sendToScreen('idle');
      });
    }
  }
  else {
    for (let button of buttons) {
      button.addEventListener("mousedown", function(e){
        sendToScreen(e.currentTarget.dataset.direction);
      });
      button.addEventListener("mouseup", function(e){
        sendToScreen('idle');
      });
    }
  }
}
