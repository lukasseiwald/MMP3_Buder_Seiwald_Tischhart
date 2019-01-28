import {isTouchDevice} from './utils';
let Draggable = require ('Draggable');

let stick = document.getElementsByClassName('movement__stick')[0];

document.getElementsByClassName('controller')[0].addEventListener('touchmove', function(event) {
  for (var i = 0; i < event.targetTouches; i++) {
    var touch = event.targetTouches[i];
    console.log('touched ' + touch.identifier);
  }
}, false);

let options = {
  limit: function (
  x,  // current X coordinate
  y,  // current Y coordinate
  x0, // original X coordinate (where drag was started)
  y0  // original Y coordinate (where drag was started)
) {

  var radius = 75,
    dx = x - x0,
    dy = y - y0,
    distance = Math.sqrt(dx*dx + dy*dy),

    // only allow dragging within a circle of radius 100
    outOfRange = distance > radius;


  // if our point is outside of the circle, compute the
  // point on the circle's edge closest to our point
  if (outOfRange) {
    x = x0 + radius * (x - x0) / distance;
    y = y0 + radius * (y - y0) / distance;
  }

  return {
    x: x,
    y: y
  };

}
}

new Draggable(stick, options);



class Stick {
  constructor() {
    console.log('Stick initialized');
  }
}

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
      e.preventDeault();
      e.stopPropagation();
      sendToScreen(e.currentTarget.dataset.direction);
    },{passive: true});
    button.addEventListener("touchend", function(e){
      e.preventDeault();
      e.stopPropagation();
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

new Stick();
