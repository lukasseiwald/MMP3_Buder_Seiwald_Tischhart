import {isTouchDevice} from './utils';

let airConsole = new AirConsole({"orientation": "landscape"});

airConsole.onReady = function() {
  //do airconsole stuff
}

airConsole.onMessage = function(from, data) {
  // var test = document.createElement('DIV');
  // test.innerHTML = "device_id: " + data;
  // document.body.appendChild(test);
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
