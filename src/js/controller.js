import {isTouchDevice} from './utils';

/* INIT CONTROLLER */

class Stick {
  constructor() {
    console.log('Stick initialized');
  }
}

let Draggable = require ('Draggable');

let stick = document.getElementsByClassName('movement__stick')[0];

stick.addEventListener('touchmove', function(event) {
  for (var i = 0; i < event.targetTouches.length; i++) {
    var touch = event.targetTouches.item(i);
    console.log('touched ' + touch.identifier);
    // var info = document.createElement('div');
    // info.innerHTML = touch.identifier;
    // document.body.appendChild(info);
    // airConsole.message(AirConsole.SCREEN, {action: null, move: "right"});
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

/* AIR CONSOLE */

let airConsole = new AirConsole({"orientation": "landscape"});

airConsole.onReady = function() {
  //do airconsole stuff
}

airConsole.onMessage = function(from, data) {
  // var test = document.createElement('DIV');
  // test.innerHTML = "device_id: " + data;
  // document.body.appendChild(test);
}

/* HANDLE CONTROLLER INTERACTION */

// function sendToScreen(event) {
//   airConsole.message(AirConsole.SCREEN, {action: {}, move: "right"});
// }

function jumpHandler(e) {
  touchstartHandler(e);
  // airConsole.message(AirConsole.SCREEN, {action: null, move: "right"});
}

function shootHandler(e) {
  touchstartHandler(e);
  // airConsole.message(AirConsole.SCREEN, {action: null, move: "left"});
}

function touchstartHandler(e) {
  e.stopPropagation();
}

function touchendHandler(e) {
  e.preventDefault();
  e.stopPropagation();
  airConsole.message(AirConsole.SCREEN, {action: "idle"});
}

let buttonjump = document.getElementsByClassName("button")[0];
let buttonshoot = document.getElementsByClassName("button")[1];
let buttons = document.getElementsByClassName("button")

if (isTouchDevice()) {
  buttonjump.addEventListener("touchstart", jumpHandler, {passive: true});
  buttonjump.addEventListener("touchend", touchendHandler);

  buttonshoot.addEventListener("touchstart", shootHandler, {passive: true});
  buttonshoot.addEventListener("touchend", touchendHandler);

  // for (let button of buttons) {
  //   button.addEventListener("touchstart", function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     sendToScreen(e.currentTarget.dataset.direction);
  //   },{passive: true});
  //   button.addEventListener("touchend", function(e){
  //     e.preventDefault();
  //     e.stopPropagation();
  //     sendToScreen('idle');
  //   });
  // }
}
else {
  buttonjump.addEventListener("mouseup", jumpHandler, {passive: true});
  buttonjump.addEventListener("mousedown", touchendHandler);

  buttonshoot.addEventListener("mouseup", shootHandler, {passive: true});
  buttonshoot.addEventListener("mousedown", touchendHandler);

  // for (let button of buttons) {
  //   button.addEventListener("mousedown", function(e){
  //     sendToScreen(e.currentTarget.dataset.direction);
  //   });
  //   button.addEventListener("mouseup", function(e){
  //     sendToScreen('idle');
  //   });
  // }
}

new Stick();
