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
    this.headline.anchor.setTo(0.5, 0.5);

    this.players = [];
    this.player = {
      id: null,
      name: '',
      character: ''
    }

    //Character Plateau's
    this.plateau1 = addImage(this, this.world.width * (1.5/10), this.world.height * .72, 'characterPlateau', 128 * 1.5, 64);
    this.plateau2 = addImage(this, this.world.width * (3.5/10), this.world.height * .72, 'characterPlateau', 128 * 1.5, 64);
    this.plateau3 = addImage(this, this.world.width * (5.5/10), this.world.height * .72, 'characterPlateau', 128 * 1.5, 64);
    this.plateau4 = addImage(this, this.world.width * (7.5/10), this.world.height * .72, 'characterPlateau', 128 * 1.5, 64);

    //Character Silhouettes
    this.sil1 = addImage(this, this.world.width * (1.1/10), this.world.height / 2.4, 'characterSilhouette', 300, 300);
    this.sil2 = addImage(this, this.world.width * (3.1/10), this.world.height / 2.4, 'characterSilhouette', 300, 300);
    this.sil3 = addImage(this, this.world.width * (5.1/10), this.world.height / 2.4, 'characterSilhouette', 300, 300);
    this.sil4 = addImage(this, this.world.width * (7.1/10), this.world.height / 2.4, 'characterSilhouette', 300, 300);

    //Player Name
    let playerNames = this.add.text(this.world.centerX, this.world.height * .5, 'Nakamurasensei', subheadlineStyling);

    //this.playerNames = window.game.global.playerManager.getAllNicknames().toString();


    window.game.global.airConsole.onMessage = function(deviceId, data) {
      let character = window.game.global.playerManager.getPlayerCharacter(deviceId);
      if(character !== null) {
        // data= {
        //   action: 'character_selected',
        //   selectedCharacter: 'egyptian'
        // }
        console.log(data.action);
        switch(data.action) {
          case 'character_selected':
            window.game.global.playerManager.setSkin(deviceId,data.selectedCharacter);
            break;
          case '':
            break;
          default:   
        }
      }
    }

    function updateScreen() {
      //this.players = window.game.global.playerManager.getPlayers();
    }
  }

  update() {

    if(window.game.global.charactersSelected) {
        this.state.start('Level1')
    }
  }


}