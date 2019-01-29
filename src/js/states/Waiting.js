import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {

  }

  create () {
    this.text = this.add.text(this.world.centerX, this.world.centerY, 'Waiting for players to join the game!', { font: '16px Arial', fill: '#0000000', align: 'center' })
    this.text.anchor.setTo(0.5, 0.5)

    this.text2 = this.add.text(this.world.centerX, (this.world.centerY + 20), window.game.global.airConsole.getControllerDeviceIds().length + '/4 players connected', { font: '16px Arial', fill: '#0000000', align: 'center' })
    this.text2.anchor.setTo(0.5, 0.5)
  }

  update() {
    let text = this.text2;
    window.game.global.airConsole.onConnect = function(device_id) {
      text.text = window.game.global.airConsole.getControllerDeviceIds().length + '/4 players connected';
    }
    window.game.global.airConsole.onDisconnect = function(device_id) {
      text.text = window.game.global.airConsole.getControllerDeviceIds().length + '/4 players connected';
    }

   if (window.game.global.airConsole.getControllerDeviceIds().length >= 2) {
     this.state.start('Level1')
   }
  }
}
