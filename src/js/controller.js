import {isTouchDevice} from './utils';
import CSM from './controllerStateManager';
import '../scss/style.scss'

let airConsole = new AirConsole({"orientation": "landscape"});

let csm = new CSM('stage');

csm.setState('waiting', 'state--waiting');
csm.setState('characterSelection', 'state--character_selection')
csm.setState('game', 'state--game');
csm.setState('winning', 'state--winning');
csm.setState('loosing', 'state--loosing');

csm.startState('waiting');

let takenSkins = new Map();
let selectedCharacter = '';

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
    case 'characterSelection':
      csm.startState('characterSelection');
      setUpCharacterSelection();
    case 'get_id':
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

function handleCharacterSelection(data) {
  switch (data.action) {
  case 'change_to_controller':
    csm.startState('game');
    setUpController();
    break;
  case 'selected_character':
    takenSkins.set(data.selectedCharacterIndex, data.selectedCharacter);
    if(selectedCharacter !== data.selectedCharacter) {
      document.getElementsByClassName(data.selectedCharacter)[0].classList.add('selection__character_inactive');
      document.getElementById('button__select').classList.add('selection__character_inactive');
    }
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
    case 'characterSelection':
      handleCharacterSelection(data);
      break;
  }
}

function sendToScreen(action) {
  airConsole.message(AirConsole.SCREEN, {action: action});
}

// function createStick() {
//   let stick = document.getElementsByClassName('movement__stick')[0];

//     let options = {
//       zone: stick,                 // active zone
//       color: "#FFFFFF",              // no dom element whatsoever
//       position: {left: '50%', top: '50%'}, // preset position for 'static' mode
//       restJoystick: true,          //
//       restOpacity: 1,              // opacity
//       size: 200,                   // nipple size
//       mode: 'static'               // 'dynamic', 'static' or 'semi'
//   };

//   let draggable = nipplejs.create(options);
//   let canDash = false;

//   draggable.on('move', function(evt, data) {
//     // console.log(data)
//     if(!canDash) {
//       if(data.distance > 40) {
//         sendToScreen(data.direction.x);
//       }
//       else {
//         sendToScreen('idle');
//       }
//     }
//   })

//   let touchBorderCnt = 0;
//   let previousDistance = undefined;

//   draggable.on('move', function(evt, data) {
//     console.log(touchBorderCnt)
//     if(data.distance > 90 && previousDistance < 80) {
//       touchBorderCnt++;
//     }
//     if(touchBorderCnt == 2) {
//       canDash = true;
//       if(data.direction.x == 'right'){
//         sendToScreen('dashRight');
//       }
//       else {
//         sendToScreen('dashLeft')
//       }
//       canDash = false;
//       touchBorderCnt = 0;
//     }
//     previousDistance = data.distance;
//   })

//   draggable.on('end', function(evt, data) {
//     sendToScreen('idle');
//   })

//   // stick.addEventListener('touchmove', function(event) {
//   //   for (let i = 0; i < event.targetTouches.length; i++) {
//   //     let touch = event.targetTouches.item(i);
//   //     console.log(draggable)
//   //     console.log('touched ' + touch.identifier);
//   //     airConsole.message(AirConsole.SCREEN, {action: null, move: "right"});
//   //   }
//   // }, false);
// }


function setUpController(){
  let buttons = document.getElementsByClassName('button');
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

  let directionButtons = document.getElementsByClassName('controller__buttons__direction')[0];
  let actionButtons = document.getElementsByClassName('button__wrapper')[0];
  let controller = document.getElementsByClassName('controller')[0];
  let previousTarget = undefined
  directionButtons.addEventListener('touchmove', function(event) {
    let touch = event.touches[0];
    let coordX = touch.pageX;
    let coordY = touch.pageY;
    let currentTarget = document.elementFromPoint(coordX, coordY);
    if(previousTarget != currentTarget) {
      previousTarget && previousTarget.classList.remove('button--active');
      currentTarget.classList.add('button--active');
      previousTarget = currentTarget;
      sendToScreen(currentTarget.dataset.direction);
    }
  });
  controller.addEventListener('touchend', function(event) {
    for(let button of buttons) {
      button.classList.remove('button--active');
    }
  });
}

function setUpCharacterSelection() {
  let deviceId = airConsole.getDeviceId();

  document.getElementById('stage').classList.add(deviceId);
  let index = 0;
  let test = document.getElementsByClassName(airConsole.getDeviceId())[0];
  let characters = document.getElementsByClassName('character');
  let name = document.getElementById('name');

  characters[0].classList.remove('character--invisible');
  characters[0].id = 'character--selected';
  name.innerText = characters[0].dataset.name;

  function checkIfSkinTaken(index) {
    let skin = takenSkins.get(index);
    if(skin) {
      document.getElementsByClassName(skin)[0].classList.add('selection__character_inactive');
      document.getElementById('button__select').classList.add('selection__character_inactive');
    }
    else {
      document.getElementById('button__select').classList.remove('selection__character_inactive');
    }
  }


  test.querySelector('#button__select_left').addEventListener('touchstart', (e)=> {
    //prev
    characters[index].id = '';
    characters[index].classList.add('character--invisible');
    index = (((index-1)%(characters.length))+(characters.length))%(characters.length);
    checkIfSkinTaken(index);
    characters[index].classList.remove('character--invisible');
    characters[index].id = 'character--selected';
    name.innerText = characters[index].dataset.name;
  });
  test.querySelector('#button__select_right').addEventListener('touchstart', ()=> {
    //next
    characters[index].classList.add('character--invisible');
    characters[index].id = '';
    index = (((index+1)%(characters.length))+(characters.length))%(characters.length);
    checkIfSkinTaken(index);
    characters[index].classList.remove('character--invisible');
    characters[index].id = 'character--selected';
    name.innerText = characters[index].dataset.name;
  });

  test.querySelector('#button__select').addEventListener('touchstart', (e)=> {
    airConsole.message(AirConsole.SCREEN,
    {
      screen: 'character_selection',
      action: 'character_selected',
      selectedCharacter: document.getElementById('character--selected').dataset.character,
      selectedCharacterIndex: index
    });
    selectedCharacter = document.getElementById('character--selected').dataset.character;
    e.currentTarget.remove();
    document.getElementById('button__select_left').style.opacity = 0;
    document.getElementById('button__select_right').style.opacity = 0;
  });
}