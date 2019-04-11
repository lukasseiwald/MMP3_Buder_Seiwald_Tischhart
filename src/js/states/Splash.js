import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    // this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    // this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    // centerGameObjects([this.loaderBg, this.loaderBar])
    //
    // this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    // this.load.image('mushroom', 'assets/images/mushroom2.png')
  }

  create () {
    window.game.global.dev = true;
    window.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    window.game.global.healthBars = [];

    if(window.game.global.dev) {
      this.state.start('CharacterSelection')
    }
    else {
      this.state.start('Waiting')
    }
  }
}