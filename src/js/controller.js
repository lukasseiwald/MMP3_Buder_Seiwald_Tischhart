import {isTouchDevice} from './utils';
import nipplejs from 'nipplejs';

/* INIT CONTROLLER */

class Stick {
  constructor() {
    console.log('Stick initialized');
  }
}

let stick = document.getElementsByClassName('controller__movement')[0];

stick.addEventListener('touchmove', function(event) {
  for (var i = 0; i < event.targetTouches.length; i++) {
    var touch = event.targetTouches.item(i);
    // console.log('touched ' + touch.identifier);
    airConsole.message(AirConsole.SCREEN, {action: null, move: "right"});
  }
}, false);

let options = {
    zone: stick,                 // active zone
    color: "green",              // no dom element whatsoever
    position: {left: '50%', top: '50%'}, // preset position for 'static' mode
    restJoystick: true,          //
    restOpacity: 1,              // opacity
    size: 150,                   // nipple size
    mode: 'static'               // 'dynamic', 'static' or 'semi'       
};

var draggable = nipplejs.create(options);
// new Draggable(stick, options);

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
  airConsole.message(AirConsole.SCREEN, {action: null, move: "left"});
}

function shootHandler(e) {
  touchstartHandler(e);
  airConsole.message(AirConsole.SCREEN, {action: null, move: "right"});
}

function touchstartHandler(e) {
  // e.preventDefault(); 
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
