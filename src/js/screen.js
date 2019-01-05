import Game from './game'
// AirConsole
var airConsole = new AirConsole();

airConsole.onReady = function() {
  console.log("screen is ready")
}

airConsole.onConnect = function(device_id) {

  airConsole.message(device_id, device_id);

var info = document.createElement('DIV');
  info.innerHTML = "device_id " + device_id + ": connected to game!";
  document.body.appendChild(info);
}

// Game
window.game = new Game()

if (window.cordova) {
  var app = {
    initialize: function () {
      document.addEventListener(
        'deviceready',
        this.onDeviceReady.bind(this),
        false
      )
    },

    // deviceready Event Handler
    //
    onDeviceReady: function () {
      this.receivedEvent('deviceready')

      // When the device is ready, start Phaser Boot state.
      window.game.state.start('Boot')
    },

    receivedEvent: function (id) {
      console.log('Received Event: ' + id)
    }
  }

  app.initialize()
}
