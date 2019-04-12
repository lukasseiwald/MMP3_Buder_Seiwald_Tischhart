import {isTouchDevice} from './utils';
import CSM from './controllerStateManager';

let airConsole = new AirConsole({"orientation": "landscape"});

let csm = new CSM('stage');

csm.setState('waiting', 'state--waiting');
csm.setState('characterSelection', 'state--character_selection')
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
  let deviceId = airConsole.getDeviceId();
  console.log();

  document.getElementById('stage').classList.add(deviceId);
  let index = 0;
  let test = document.getElementsByClassName(airConsole.getDeviceId())[0];
  let characters = document.getElementsByClassName('character');
  let name = document.getElementById('name');

  characters[0].classList.remove('character--invisible');
  characters[0].id = 'character--selected';
  name.innerText = characters[0].dataset.name;


  test.querySelector('#button__select_left').addEventListener('touchstart', (e)=> {
    //prev
    characters[index].id = '';
    characters[index].classList.add('character--invisible');
    index = (((index-1)%(characters.length))+(characters.length))%(characters.length);
    characters[index].classList.remove('character--invisible');
    characters[index].id = 'character--selected';
    name.innerText = characters[index].dataset.name;
  });
  test.querySelector('#button__select_right').addEventListener('touchstart', ()=> {
    //next
    characters[index].classList.add('character--invisible');
    characters[index].id = '';
    index = (((index+1)%(characters.length))+(characters.length))%(characters.length);
    characters[index].classList.remove('character--invisible');
    characters[index].id = 'character--selected';
    name.innerText = characters[index].dataset.name;
  });

  test.querySelector('#button__select').addEventListener('touchstart', (e)=> {
    console.log(document.getElementById('character--selected').dataset.character);
    airConsole.message(AirConsole.SCREEN,
    {
      screen: 'character_selection',
      action: 'character_selected',
      selectedCharacter: document.getElementById('character--selected').dataset.character
    });
    e.currentTarget.remove();
    document.getElementById('button__select_left').style.opacity = 0;
    document.getElementById('button__select_right').style.opacity = 0;
  });
}
