import Phaser from 'phaser'
import { centerGameObjects, addImage } from '../utils'
import Particle from '../Particle';
import { headlineStyling, subheadlineStyling } from '../stylings'

export default class extends Phaser.State {
  init () {}

  preload () {}

  create () {
    this.timer = 0;
    let that = this;
    let namesSet = false;
    let characterSelectedCounter = 0;

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

    this.headline = this.add.text(this.world.centerX, this.world.height * .3, 'Select Your Fighter', headlineStyling)
    this.headline.anchor.setTo(0.5, 0.5);

    this.player = {
      id: null,
      name: '',
      character: ''
    }

    //Character Plateau's
    this.plateau1 = addImage(this, this.world.width * (1.5/10), this.world.height * .67, 'characterPlateau', 128 * 1.5, 64);
    this.plateau2 = addImage(this, this.world.width * (3.5/10), this.world.height * .67, 'characterPlateau', 128 * 1.5, 64);
    this.plateau3 = addImage(this, this.world.width * (5.5/10), this.world.height * .67, 'characterPlateau', 128 * 1.5, 64);
    this.plateau4 = addImage(this, this.world.width * (7.5/10), this.world.height * .67, 'characterPlateau', 128 * 1.5, 64);


    let playerSettings = [
      {
        skin: 'characterSilhouette',
        x: this.world.width * .21,
        y: this.world.height * .58,
        nickname : 'player 1',
        xText: this.world.width * 0.22,
        yText: this.world.height * .79
      },
      {
        skin: 'characterSilhouette',
        x: this.world.width * .41,
        y: this.world.height * .58,
        nickname : 'player 2',
        xText: this.world.width * 0.42,
        yText: this.world.height * .79
      },
      {
        skin: 'characterSilhouette',
        x: this.world.width * .62,
        y: this.world.height * .58,
        nickname : 'player 3',
        xText: this.world.width * 0.62,
        yText: this.world.height * .79
      },
      {
        skin: 'characterSilhouette',
        x: this.world.width * .82,
        y: this.world.height * .58,
        nickname : 'player 4',
        xText: this.world.width * 0.82,
        yText: this.world.height * .79
      }
    ]

    // //Character Silhouettes
    let player1 = addImage(this, this.world.width * 0.11, this.world.height / 2.4, 'characterSilhouette', 300, 300);
    let player2 = addImage(this, this.world.width * 0.31, this.world.height / 2.4, 'characterSilhouette', 300, 300);
    let player3 = addImage(this, this.world.width * 0.51, this.world.height / 2.4, 'characterSilhouette', 300, 300);
    let player4 = addImage(this, this.world.width * 0.71, this.world.height / 2.4, 'characterSilhouette', 300, 300);

    window.game.global.airConsole.onMessage = function(deviceId, data) {
      let character = window.game.global.playerManager.getPlayerCharacter(deviceId);
      if(character !== null) {
        switch(data.action) {
          case 'character_selected':
            window.game.global.playerManager.setSkin(deviceId,data.selectedCharacter);
            getPlayers();
            break;
          case '':
            break;
          default:
        }
      }
    }
    
    
    function getPlayers() {
      let index = 0;
      characterSelectedCounter += 1;

      let players = window.game.global.playerManager.getPlayers();

      for (let [key, value] of players) {
        if(!namesSet) {
          let text = that.add.text(playerSettings[index].xText, playerSettings[index].yText, value.nickname, subheadlineStyling);
          text.anchor.setTo(0.5, 0.5);
        }
        if(value.skin != undefined) {
          switch(index) {
            case 0:
              player1.kill();
              player1 = window.game.add.sprite(playerSettings[index].x, playerSettings[index].y, value.skin);
              player1.scale.setTo(3, 3);
              player1.anchor.set(0.5, 0.5);
              player1.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
              player1.animations.play('idle');
              break;
            case 1:
              player2.kill();
              player2 = window.game.add.sprite(playerSettings[index].x, playerSettings[index].y, value.skin);
              player2.scale.setTo(3, 3);
              player2.anchor.set(0.5, 0.5);
              player2.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
              player2.animations.play('idle');
              break;
            case 2:
              player3.kill();
              player3 = window.game.add.sprite(playerSettings[index].x, playerSettings[index].y, value.skin);
              player3.scale.setTo(-3, 3);
              player3.anchor.set(0.5, 0.5);
              player3.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
              player3.animations.play('idle');
              break;
            case 3:
              player4.kill();
              player4 = window.game.add.sprite(playerSettings[index].x, playerSettings[index].y, value.skin);
              player4.scale.setTo(-3, 3);
              player4.anchor.set(0.5, 0.5);
              player4.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
              player4.animations.play('idle');
              break;
            default:
              break;
          }
        }
        index++;
      }
      namesSet = true;
      if(characterSelectedCounter > 3) {
        countToFight();
      }
    }
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
    }
  }
}
