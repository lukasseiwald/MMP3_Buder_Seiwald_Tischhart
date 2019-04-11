import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {
    console.log("Character Selection")
  }

  preload () {

  }

  create () {

    if(window.game.global.charactersSelected) {
      this.state.start('Level1')
    }
  }
}
