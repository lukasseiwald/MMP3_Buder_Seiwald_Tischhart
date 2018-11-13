var airConsole = new AirConsole();

airConsole.onMessage = function(from, data) {
  var test = document.createElement('DIV');
   test.innerHTML = "device_id: " + data;
   document.body.appendChild(test);
}
