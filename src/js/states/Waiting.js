import Phaser from 'phaser'
import { centerGameObjects, addImage } from '../utils'
import { headlineStyling, subheadlineStyling } from '../stylings'
import PlayerManager from '../PlayerManager';
import Particle from '../Particle';

export default class extends Phaser.State {

  init () {}

  create () {
    window.game.global.playerManager = new PlayerManager();
    window.game.global.playerManager.setConnectedPlayers();

    this.timer = 0;
    let that = this;

    //IMAGES
    addImage(this, 0, 0, 'background1', this.world.width, this.world.height);
    addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

    //PARTICLES

    this.glowingParticles = new Particle();
    this.glowingParticles.startEmitter();


    //TEXT ELEMENTS

    this.headline = this.add.text(this.world.centerX, this.world.height * .3, 'Waiting for players to join the game!', headlineStyling)
    this.headline.anchor.setTo(0.5, 0.5)

    let playerNames = this.add.text(this.world.centerX, this.world.height * .5, '', subheadlineStyling);
    playerNames.anchor.setTo(0.5, 0.5);

    this.touchToContinue = this.add.text(this.world.centerX, this.world.centerY + 200, '', subheadlineStyling);
    this.touchToContinue.anchor.setTo(0.5, 0.5);
    let touchToContinue = this.touchToContinue;

    let numberOfPlayers = this.add.text(this.world.centerX, this.world.height * .35, window.game.global.playerManager.getConnectedPlayerNum() + '/4 players connected', subheadlineStyling);
    numberOfPlayers.anchor.setTo(0.5, 0.5);

    //FUNCTIONS & LISTENERS

    window.game.global.airConsole.onConnect = function(deviceId) {
      if(window.game.global.playerManager.getConnectedPlayerNum() < 4) {
        window.game.global.playerManager.addPlayer(deviceId);
        updateScreen();
      }
      if (window.game.global.playerManager.getConnectedPlayerNum() >= 4) {
        let masterId = window.game.global.playerManager.getMaster();
        touchToContinue.text = "Master Player (" + window.game.global.playerManager.getNickname(masterId) + ") please tap on Touchscreen to continue";
        window.game.global.playerManager.sendMessageToPlayer(masterId,
          {
            screen: 'waiting',
            action: 'touch_to_continue'
          }
        );
      }
    }

    window.game.global.airConsole.onDisconnect = function(deviceId) {
      window.game.global.playerManager.removePlayer(deviceId);
      updateScreen();

      //TODO: remove touch event from master device -> because no longer able to continue
    }

    window.game.global.airConsole.onMessage = function(deviceId, data) {
      switch (data.action) {
        case 'start_game':
          window.game.global.airConsole.broadcast(
            {
              screen: 'waiting',
              action: 'change_to_controller'
            })
          that.state.start('Level1')
          break;
      }
    }

    function updateScreen() {
      numberOfPlayers.text = window.game.global.playerManager.getConnectedPlayerNum() + '/4 players connected';
      playerNames.text = window.game.global.playerManager.getAllNicknames().toString();
    }
  }

  update() {
    //blinking effect on screen
    if (window.game.global.playerManager.getConnectedPlayerNum() >= 4) {
      this.timer += this.time.elapsed;
      if ( this.timer >= 1000 ) {
        this.timer -= 1000;
        this.touchToContinue.alpha = this.touchToContinue.alpha === .5 ? 1 : .5;
      }
    }


    //particle visibility (fading in and out)
    this.glowingParticles.updateVisibility();
  }
}
