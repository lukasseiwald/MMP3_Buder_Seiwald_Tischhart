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

    var LIFECYCLE = 8000;
    
    // Create a particle emitter along the bottom of the stage
    this.emitter = game.add.emitter(game.world.centerX, game.world.height-150, 50);
    this.emitter.width = game.width-50;
    
    // Particle behaviour ranges to create a smoke drift-like effect
    this.emitter.minParticleScale = 0.1;
    this.emitter.maxParticleScale = 0.9;
    this.emitter.minRotation = -5;
    this.emitter.maxRotation = 5;
    this.emitter.setYSpeed(-2, -5);
    this.emitter.setXSpeed(10, 20);
    this.emitter.gravity = -10;
    
    // Particle alpha will ease from 0 to 0.2 and back again, for fade in/out
    this.emitter.setAlpha(0, 0.2, LIFECYCLE/2, Phaser.Easing.Quadratic.InOut, true);
    
    // Start the emitter
    this.emitter.makeParticles('smoke');
    this.emitter.start(false, LIFECYCLE, 100, 0);
    
    // add GUI
    // var gui = new dat.GUI();
    // gui.add(this.emitter, 'gravity').min(-20).max(20).name('Gravity');
    // gui.add(this.emitter, 'maxRotation').min(0).max(20).name('Rotation');
    // gui.close();
    

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
        that.state.start('Level1')
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

    // let emitter = this.emitter
    // emitter.forEachAlive(function(p){
    //     console.log(p.alpha)
    //     if(p.lifespan <= emitter.lifespan/ 2) {// fading out
    //       p.alpha= 0.2*(p.lifespan / (emitter.lifespan/2));
    //     }
    // });
  }
}
