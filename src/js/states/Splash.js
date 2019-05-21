import Phaser from 'phaser'

export default class extends Phaser.State {
  init () {}

  preload () {
  }

  create () {
    window.game.global.dev = false;
    window.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    window.game.global.healthBars = [];
    //Scores
    window.game.global.score = new Object();
    window.game.global.score.egyptian = 0;
    window.game.global.score.knight = 0;
    window.game.global.score.kickapoo = 0;
    window.game.global.score.lucifer = 0;

    if(window.game.global.dev) {
      this.state.start('Level1')
    }
    else {
      this.state.start('Waiting')
    }
  }
}
