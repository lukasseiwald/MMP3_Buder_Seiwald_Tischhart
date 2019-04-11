import {isTouchDevice} from './utils';
import CSM from './controllerStateManager';
import nipplejs from 'nipplejs';

let airConsole = new AirConsole({"orientation": "landscape"});

let csm = new CSM('stage');

csm.setState('waiting', 'state--waiting');
csm.setState('game', 'state--game');
csm.setState('winning', 'state--winning');
csm.setState('loosing', 'state--loosing');

csm.startState('waiting');

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
            action: 'start_game'
          });
      })
      break;
    case 'change_to_controller':
      csm.startState('game');
      setUpController();
      break;
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

function createStick() {
  let stick = document.getElementsByClassName('movement__stick')[0];

    let options = {
      zone: stick,                 // active zone
      color: "#FFFFFF",              // no dom element whatsoever
      position: {left: '50%', top: '50%'}, // preset position for 'static' mode
      restJoystick: true,          //
      restOpacity: 1,              // opacity
      size: 200,                   // nipple size
      mode: 'static'               // 'dynamic', 'static' or 'semi'       
  };

  let draggable = nipplejs.create(options);

  draggable.on('move', function(evt, data) {
    console.log(data)
    if(data.distance > 40) {
      sendToScreen(data.direction.x);
    }
    else {
      sendToScreen('idle');
    }
  })

  draggable.on('end', function(evt, data) {
    sendToScreen('idle');
  })

  // stick.addEventListener('touchmove', function(event) {
  //   for (let i = 0; i < event.targetTouches.length; i++) {
  //     let touch = event.targetTouches.item(i);
  //     console.log(draggable)
  //     console.log('touched ' + touch.identifier);
  //     airConsole.message(AirConsole.SCREEN, {action: null, move: "right"});
  //   }
  // }, false);
}

function setUpController(){
  let buttons = document.getElementsByClassName('button');
  createStick();

  if (isTouchDevice) {
    for (let button of buttons) {
      button.addEventListener("touchstart", function(e){
        sendToScreen(e.currentTarget.dataset.direction);
        button.classList.add('button--active');
      },{passive: true});

      button.addEventListener("touchend", function(e){
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
        button.classList.remove('button--active');
      });
    }
  }
}
