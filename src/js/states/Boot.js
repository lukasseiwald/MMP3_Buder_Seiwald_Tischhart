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

    //LOAD BACKGROUND
    this.load.image('background1', '../../assets/images/background/BG-1.png');
    this.load.image('background2', '../../assets/images/background/BG-2.png');
    this.load.image('background3', '../../assets/images/background/BG-3.png');

    //LOAD TILES
    this.load.spritesheet('tiles', '../../assets/tileMap/tileSet.png', 33, 33, 7);

    //LOAD BASES
    this.load.image('egyptian_base', '../../assets/bases/egyptian_base.png');
    this.load.image('knight_base', '../../assets/bases/knight_base.png');
    this.load.image('lucifer_base', '../../assets/bases/lucifer_base.png');
    this.load.image('kickapoo_base', '../../assets/bases/kickapoo_base.png');

    //LOAD PLAYERS
    this.load.atlasJSONHash('egyptian', '../../assets/characters/egyptian/egyptian.png', '../../assets/characters/egyptian/egyptian.json');
    this.load.atlasJSONHash('knight', '../../assets/characters/knight/knight.png', '../../assets/characters/knight/knight.json');
    this.load.atlasJSONHash('lucifer', '../../assets/characters/lucifer/lucifer.png', '../../assets/characters/lucifer/lucifer.json');
    this.load.atlasJSONHash('knight', '../../assets/characters/kickapoo/kickapoo.png', '../../assets/characters/kickapoo/kickapoo.json');

    //LOAD SOULS
    this.load.spritesheet('egyptian_soul', '../../assets/characters/egyptian/egyptian_soul.png', 32, 32, 3);
    this.load.spritesheet('knight_soul', '../../assets/characters/knight/knight_soul.png', 32, 32, 3);
    this.load.spritesheet('lucifer_soul', '../../assets/characters/egyptian/egyptian_soul.png', 32, 32, 3);
    this.load.spritesheet('kickapoo_soul', '../../assets/characters/knight/knight_soul.png', 32, 32, 3);

    //LOAD BULLETS
    this.load.image('egyptian_bullet', '../../assets/characters/egyptian/egyptian_bullet.png');
    this.load.image('knight_bullet', '../../assets/characters/knight/knight_bullet.png');
    this.load.image('lucifer_bullet', '../../assets/characters/egyptian/egyptian_bullet.png');
    this.load.image('kickapoo_bullet', '../../assets/characters/knight/knight_bullet.png');
    
    //LOADING FONTS

    if (config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts
        },
        active: this.fontsLoaded
      });
    }


    //LOAD CHARACTERS

    this.load.atlasJSONHash('egyptian', '../../assets/characters/egyptian/egyptian.png', '../../assets/characters/egyptian/egyptian.json');
    this.load.atlasJSONHash('knight', '../../assets/characters/knight/knight.png', '../../assets/characters/knight/knight.json');
    //this.load.atlasJSONHash('lucifer', '../../assets/characters/lucifer/lucifer.png', '../../assets/characters/lucifer/lucifer.json');
    //this.load.atlasJSONHash('knight', '../../assets/characters/kickapoo/kickapoo.png', '../../assets/characters/kickapoo/kickapoo.json');

    //LOAD SOULS

    this.load.spritesheet('egyptian_soul', '../../assets/characters/egyptian/egyptian_soul.png', 32, 32, 3);
    this.load.spritesheet('knight_soul', '../../assets/characters/knight/knight_soul.png', 32, 32, 3);

    // LOAD BULLETS

    this.load.image('egyptian_bullet', '../../assets/characters/egyptian/egyptian_bullet.png');
    this.load.image('knight_bullet', '../../assets/characters/knight/knight_bullet.png');

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
