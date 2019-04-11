import 'pixi'
import 'p2'
import Phaser from 'phaser'

import BootState from './states/Boot'
import SplashState from './states/Splash'
import Waiting from './states/Waiting'
import CharacterSelection from './states/CharacterSelection'
import Level1 from './levels/Level1'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    //1840 1020
    super("100%", "100%", Phaser.CANVAS, 'content', null)

    this.state.add('Boot', BootState, false);
    this.state.add('Splash', SplashState, false);
    this.state.add('Waiting', Waiting, false);
    this.state.add('CharacterSelection', CharacterSelection, false);
    this.state.add('Level1', Level1, false);
    this.state.start('Boot');
  }
}

export default Game;
