import Phaser from 'phaser';
import WebFont from 'webfontloader';
import config from '../config';

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#EDEEC9';
    this.fontsReady = false;
    this.fontsLoaded = this.fontsLoaded.bind(this);

    //stop game from pausing when game window is not in focus
    this.stage.disableVisibilityChange = true;
  }

  preload() {
    this.load.image('background', '../../assets/images/background/BG-1.png');
    this.load.image('background2', '../../assets/images/background/BG-2.png');

    if (config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts
        },
        active: this.fontsLoaded
      });
    }

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Sarabun', fill: '#dddddd', align: 'center' });
    text.anchor.setTo(0.5, 0.5);

  }

  render() {
    if (config.webfonts.length && this.fontsReady) {
      this.state.start('Splash');
    }
    if (!config.webfonts.length) {
      this.state.start('Splash');
    }
  }

  fontsLoaded() {
    this.fontsReady = true;
  }
}
