import Phaser from 'phaser'
import { centerGameObjects, addImage } from '../utils'
import Particle from '../Particle';
import { headlineStyling, subheadlineStyling } from '../stylings'
import {playerConfig} from '../configs/playerConfig'

export default class extends Phaser.State {
  init () {
    console.log("Character Selection")
  }

  preload () {

  }

  create () {
    this.timer = 0;

    //IMAGES
    this.bg1 = addImage(this, 0, 0, 'background1', this.world.width, this.world.height);

    //Particles
    // this.glowingParticles = new Particle("spark", 30, 5000, 100);
    // this.glowingParticles.startEmitter();

    // this.steamParticles = new Particle("smoke", 150, 8000, 100);
    // this.steamParticles.startEmitter();    

    // this.bg3 = addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

    // this.lavaParticles = new Particle("lava", 0, 4000, 1);
    // this.lavaParticles.startEmitter();

    //Background Frame
    this.bg4 = addImage(this, 0, 0, 'backgroundCharacterSelection', this.world.width, this.world.height);


    //TEXT ELEMENTS

    this.headline = this.add.text(this.world.centerX, this.world.height * .3, 'Select Your Fighter', headlineStyling)
    this.headline.anchor.setTo(0.5, 0.5)

    //CHAARACTER PLATEAU's
    this.plateau1 = addImage(this, this.world.width * (1.5/10), this.world.height * .72, 'characterPlateau', 128 * 1.5, 64);
    this.plateau2 = addImage(this, this.world.width * (3.5/10), this.world.height * .72, 'characterPlateau', 128 * 1.5, 64);
    this.plateau3 = addImage(this, this.world.width * (5.5/10), this.world.height * .72, 'characterPlateau', 128 * 1.5, 64);
    this.plateau4 = addImage(this, this.world.width * (7.5/10), this.world.height * .72, 'characterPlateau', 128 * 1.5, 64);

    this.sil1 = addImage(this, this.world.width * (1.1/10), this.world.height / 2.4, 'characterSilhouette', 300, 300);
    this.sil2 = addImage(this, this.world.width * (3.1/10), this.world.height / 2.4, 'characterSilhouette', 300, 300);
    this.sil3 = addImage(this, this.world.width * (5.1/10), this.world.height / 2.4, 'characterSilhouette', 300, 300);
    this.sil4 = addImage(this, this.world.width * (7.1/10), this.world.height / 2.4, 'characterSilhouette', 300, 300);

    // index += 1;
    
    // for (let [deviceId, value] of window.game.global.playerManager.getPlayers()) {
    //     let character = new Player(deviceId, characterSettings[index].x, characterSettings[index].y, characterSettings[index].skin);
    //     let base = new Base(map.tsize,characterSettings[index].baseX, characterSettings[index].baseY, characterSettings[index].skin + '_base', character);
    //     let healthBar = this.game.add.sprite(characterSettings[index].baseX - 50, characterSettings[index].baseY - 100, bmd);
    //     healthBar.cropEnabled = true;
    //     healthBar.crop(widthLife);
    //     this.game.global.healthBars[deviceId] = healthBar;
    //     character.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);
    //     window.game.global.playerManager.setCharacter(deviceId, character);
    //     index += 1;
    //   }
  }

  update() {
    window.game.global.airConsole.onMessage = function(deviceId, data) {
      let character = window.game.global.playerManager.getPlayerCharacter(deviceId);
      if(character !== null) {
        console.log(data.action);
      //   switch(data.action) {
      //     case 'right':
      //       character.moveToRight();
      //       character.movingTo = 'right';
      //       break;
      //     case 'left':
      //       character.movingTo = 'left';
      //       break;
      //     case 'jump':
      //       character.jump();
      //       break;
      //     case 'shoot':
      //       character.shoot();
      //       break;
      //     default:
      //       character.movingTo = null;
      //       character.idle()
      // }
    }
  } 

    if(window.game.global.charactersSelected) {
        this.state.start('Level1')
    }
  }
}