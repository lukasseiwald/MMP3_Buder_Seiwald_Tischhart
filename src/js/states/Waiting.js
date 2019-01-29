import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
  }

  create () {
    this.text = this.add.text(this.world.centerX, this.world.centerY, 'Waiting for players to join the game!', { font: '16px Bungee', fill: '#0000000', align: 'center' })
    this.text.anchor.setTo(0.5, 0.5)


    this.text3 = this.add.text(this.world.centerX, (this.world.centerY + 70), '', { font: '16px Sarabun', fill: '#0000000', align: 'center' })
    this.text3.anchor.setTo(0.5, 0.5)

    window.game.global.players = new Map();
    this.setConnectedPlayers();

    this.text2 = this.add.text(this.world.centerX, (this.world.centerY + 20), window.game.global.players.size + '/4 players connected', { font: '16px Arial', fill: '#0000000', align: 'center' })
    this.text2.anchor.setTo(0.5, 0.5)

    this.text4 = this.add.text(this.world.centerX, (this.world.centerY + 200), '', { font: '16px Sarabun', fill: '#0000000', align: 'center' })
    this.text4.anchor.setTo(0.5, 0.5)

  }

  setConnectedPlayers() {
    for (let deviceId of window.game.global.airConsole.getControllerDeviceIds()) {
      window.game.global.players.set(deviceId, {
        nickname: window.game.global.airConsole.getNickname(deviceId)
      })
    }
    console.log(window.game.global.players);
  }

  update() {

    let text = this.text2;
    let text2 = this.text3;
    let that = this;

    function updateScreen() {
      that.setConnectedPlayers();

      text.text = window.game.global.players.size + '/4 players connected';

      let names = new Array();
      for (let playerId of window.game.global.airConsole.getControllerDeviceIds()) {
        names.push(window.game.global.airConsole.getNickname(playerId))
      }

      text2.text = names.toString();
    }

    window.game.global.airConsole.onConnect = function(deviceId) {
      updateScreen();

    }
    window.game.global.airConsole.onDisconnect = function(deviceId) {
      if (window.game.global.players.has(deviceId)) {
        window.game.global.players.delete(deviceId)
      }
      updateScreen();
    }

   if (window.game.global.players.size >= 3) {
     let master = window.game.global.airConsole.getMasterControllerDeviceId();

     //this.text4.text = "Master Player (" + window.game.global.players.get(master).nickname + ") please press on Touchscreen to continue";

     //window.game.global.airConsole.message(master, 'test')

     window.game.global.airConsole.broadcast('test')


     //masterplayer has to press on the display to continue - save player device id + name in global scope
     // later start character selection - now game is starting instantly -> fixed characters
     this.state.start('Level1')
   }
  }
}
