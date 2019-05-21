import Phaser from 'phaser'
import { centerGameObjects, addImage } from '../utils'
import Particle from '../Particle';
import { headlineStyling, subheadlineStyling } from '../stylings'

export default class extends Phaser.State {
  init ()  { 
    this.scale = window.game.global.scale;
    this.unit = window.game.global.unit;
  }

  preload () { }

  create () {
    this.timer = 0;
    let that = this;

    //IMAGES
    this.bg1 = addImage(this, 0, 0, 'background1', this.world.width, this.world.height);

    this.glowingParticles = new Particle("spark", 30, 5000, 100);
    this.glowingParticles.startEmitter();

    this.steamParticles = new Particle("smoke", 150, 8000, 100);
    this.steamParticles.startEmitter();

    //Lava Bg
    // this.bg3 = addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

    this.lavaParticles = new Particle("lava", 0, 4000, 1);
    this.lavaParticles.startEmitter();

    //Background Frame
    this.bg4 = addImage(this, 0, 0, 'backgroundCharacterSelection', this.world.width, this.world.height);

    //TEXT ELEMENTS

    this.headline = this.add.text(this.world.centerX, this.world.height * .3, '', headlineStyling)
    this.headline.anchor.setTo(0.5, 0.5);

    let playerSettings = [
      {
        deviceId: null,
        character: null,
        x: window.game.world.centerX - this.unit * 20,
      },
      {
        deviceId: null,
        character: null,
        x: window.game.world.centerX - this.unit * 10,
      },
      {
        deviceId: null,
        character: null,
        x: window.game.world.centerX + this.unit * 10,
      },
      {
        deviceId: null,
        character: null,
        x: window.game.world.centerX + this.unit * 20,
      }
    ]

    this.characters = new Map();

    function getPlayers() {
      let players = window.game.global.playerManager.getPlayers();
      let index = 0;

      for (let [key, value] of players) {
        //Sprite
        let character = window.game.add.sprite(playerSettings[index].x, window.game.world.height * .4, value.skin);
        if(index < 2) {
          character.scale.setTo(that.scale * 2, that.scale * 2);
        }
        else {
          character.scale.setTo(- (that.scale * 2), that.scale * 2);
        }
        
        character.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
        character.animations.add('throw', ['Throwing_000','Throwing_001','Throwing_002','Throwing_003','Throwing_004','Throwing_005','Throwing_006','Throwing_007','Throwing_008','Throwing_009','Throwing_010','Throwing_011'], 20, false);
        character.animations.add('slash', ['Slashing_000','Slashing_001','Slashing_002','Slashing_003','Slashing_004','Slashing_005','Slashing_006','Slashing_007','Slashing_008','Slashing_009','Slashing_010','Slashing_011'], 15, false);
        character.animations.add('dying', ['Dying_000','Dying_001','Dying_002','Dying_003','Dying_004','Dying_005','Dying_006','Dying_007','Dying_008','Dying_009','Dying_010','Dying_011','Dying_012','Dying_013','Dying_014'], 17, false);
        character.animations.add('kicking', ['Kicking_000','Kicking_001','Kicking_002','Kicking_003','Kicking_004','Kicking_005','Kicking_006','Kicking_007','Kicking_008','Kicking_009','Kicking_010','Kicking_011'], 17, false);
        character.animations.play('idle');
        let nickname = that.add.text(character.x + character.width / 2, character.top - character.height / 7, value.nickname, subheadlineStyling);
        nickname.anchor.setTo(0.5, 0.5);
        let score = that.add.text(character.x + character.width / 2, character.bottom + character.height / 5, value.score, subheadlineStyling);
        score.anchor.setTo(0.5, 0.5);

        that.characters.set(value.deviceId, character);
        index++;
      }
    }

    window.game.global.airConsole.onMessage = function(deviceId, data) { 
      if(data.screen == 'emotes') {
        let emoteType = data.emote;
        playEmote(emoteType, deviceId);
      }
    }

    function playEmote(emoteType, deviceId) {
      let player = that.characters.get(deviceId);
      console.log(player);
      switch(emoteType) {
        case 'emote1': 
          player.animations.play('slash');
          break;
        case 'emote2': 
          player.animations.play('dying');
          break;
        case 'emote3': 
          player.animations.play('kicking');
          break;
        case 'emote4': 
          player.animations.play('throw');
          break;
        default:
          break;
      }          
    }
       
    function countToFight() {
      that.headline.setText("GET READY TO FIGHT!")

      //Style of Fight Counter
     let style = { font: "45px Bungee", fill: "#111111", align: "center" };

    let counter = 5;
    let text = window.game.add.text(that.world.width / 2 - 20, that.world.height / 14, '', style);
    let startGameTimer = setInterval(() => {
      text.setText(counter);
      if(counter < 1) {
        clearInterval(startGameTimer);
        window.game.global.airConsole.broadcast(
          {
            screen: 'game',
            action: 'change_to_controller'
          })
        that.state.start('Level1');
      }
      counter = counter - 1;
     }, 1000);
    }

    //countToFight();
    getPlayers();
  }
}
