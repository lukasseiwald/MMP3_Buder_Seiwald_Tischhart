import Phaser from 'phaser'
import {addImage } from '../utils'
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
        skin: 'egyptian_head',
        score: 0,
        x: window.game.world.centerX - this.unit * 20,
        nickname: ''
      },
      {
        skin: 'knight_head',
        score: 0,
        x: window.game.world.centerX - this.unit * 9,
        nickname: ''
      },
      {
        skin: 'lucifer_head',
        score: 0,
        x: window.game.world.centerX + this.unit * 2,
        nickname: ''
      },
      {
        skin: 'kickapoo_head',
        score: 0,
        x: window.game.world.centerX + this.unit * 12,
        nickname: ''
      }
    ]

    function getPlayers() {
      let characters = {};
      let players = window.game.global.playerManager.getPlayers();
      console.log(players);
      let index = 0;

      for (let [key, value] of players) {
        // playerSettings[index].skin = value.skin;
        // playerSettings[index].nickname = value.nickname;
        //Sprite
        let player = window.game.add.sprite(playerSettings[index].x, window.game.world.height * .4, value.skin);
        player.scale.setTo(that.scale * 2, that.scale * 2);
        player.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
        player.animations.play('idle');
        //Nickname
        console.log(player);
        let nickname = that.add.text(player.x + player.width / 2, player.top - player.height / 7, value.nickname, subheadlineStyling);
        nickname.anchor.setTo(0.5, 0.5);
        let score = that.add.text(player.x + player.width / 2, player.bottom + player.height / 5, value.score, subheadlineStyling);
        score.anchor.setTo(0.5, 0.5);
        index++;
      }
    }

    window.game.global.airConsole.onMessage = function(deviceId, data) {
      //countToFight();
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
