import Phaser from 'phaser'
import { centerGameObjects, addImage } from '../utils'
import Particle from '../Particle';
import { headlineStyling, subheadlineStyling } from '../stylings'

export default class extends Phaser.State {
  init ()  { 
    this.unit = window.game.global.unit;
  }

  preload () { }

  create () {
    this.timer = 0;
    let that = this;

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
    this.bg4 = addImage(this, 0, 0, 'backgroundCharacterSelection', window.innerWidth, window.innerHeight);

    //TEXT ELEMENTS

    // this.headline = this.add.text(this.world.centerX, this.world.height * .3, 'Score', headlineStyling)
    // this.headline.anchor.setTo(0.5, 0.5);


    let playerSettings = [
      {
        skin: 'egyptian_head',
        character: 'egyptian',
        score: window.game.global.score["egyptian"],
        x: window.game.world.centerX - this.unit * 15,
        y: this.world.height * .5,
        xText: this.world.width * 0.23,
        yText: this.world.height * .79
      },
      {
        skin: 'knight_head',
        character: 'knight',
        score: window.game.global.score["knight"],
        x: window.game.world.centerX - this.unit * 5,
        y: this.world.height * .5,
        xText: this.world.width * 0.43,
        yText: this.world.height * .79
      },
      {
        skin: 'lucifer_head',
        character: 'lucifer',
        score: window.game.global.score["lucifer"],
        x: window.game.world.centerX + this.unit * 5,
        y: this.world.height * .5,
        xText: this.world.width * 0.63,
        yText: this.world.height * .79
      },
      {
        skin: 'kickapoo_head',
        character: 'kickapoo',
        score: window.game.global.score["kickapoo"],
        x: window.game.world.centerX + this.unit * 15,
        y: this.world.height * .5,
        xText: this.world.width * 0.83,
        yText: this.world.height * .79
      }
    ]

    playerSettings.forEach(player => {
        addImage(this, player.x, player.y, player.skin, 100, 100);
        let text = this.add.text(player.xText, player.yText, player.score, subheadlineStyling);
        text.anchor.setTo(0.5, 0.5);
    });

    console.log( this.unit);
    console.log(playerSettings[0].x);

    // let character = window.game.global.playerManager.getPlayerCharacter(1);
    // console.log(character);

    /*    
    function countToFight() {
      that.headline.setText("GET READY TO FIGHT!")

      //Style of Fight Counter
     let style = { font: "45px Bungee", fill: "#111111", align: "center" };

     let counter = 5;
     let text = window.game.add.text(that.world.width / 2.32, that.world.height / 14, '', style);
     let startGameTimer = setInterval(() => {
       text.setText(counter);
       if(counter < 1) {
         clearInterval(startGameTimer);
         window.game.global.airConsole.broadcast(
           {
             screen: 'characterSelection',
             action: 'change_to_controller'
           })
         that.state.start('Level1')
       }
       counter = counter - 1;
     }, 1000);
    }*/
  }
}
