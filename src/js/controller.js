var airConsole = new AirConsole({"orientation": "landscape"});

airConsole.onReady = function() {
  //do airconsole stuff
}

airConsole.onMessage = function(from, data) {
  var test = document.createElement('DIV');
  test.innerHTML = "device_id: " + data;
  document.body.appendChild(test);
}

function move(e) {
  let target = e.currentTarget;
  airConsole.message(AirConsole.SCREEN, {move: target.dataset.direction});
}

let buttons = document.getElementsByClassName('button');
console.log(buttons);

for (let button of buttons) {
  button.addEventListener("click", function(e){
    move(e);
  });

  button.addEventListener("touchstart", function(e){
    move(e);
  });
}
