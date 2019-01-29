import {isTouchDevice} from './utils';

let airConsole = new AirConsole({"orientation": "landscape"});

airConsole.onReady = function() {

}

airConsole.onMessage = function(from, data) {

}

function sendToScreen(action) {
  airConsole.message(AirConsole.SCREEN, {action: action});
}

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
