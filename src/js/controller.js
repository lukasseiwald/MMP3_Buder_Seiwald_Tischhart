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

let left = document.getElementById('button_one');
let right = document.getElementById('button_two');

left.addEventListener("click", function(e){
  move(e);
});

left.addEventListener("touchstart", function(e){
  move(e);
});

right.addEventListener("click", function(e){
  move(e);
});

right.addEventListener("touchstart", function(e){
  move(e);
});
