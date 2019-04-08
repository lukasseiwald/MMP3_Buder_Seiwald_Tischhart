import Phaser from 'phaser'
import { centerGameObjects, addImage } from '../utils'
import { headlineStyling, subheadlineStyling } from '../stylings'
import PlayerManager from '../PlayerManager';

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

    let sparkParticle = function (game, x, y) {

      Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));

    };

    sparkParticle.prototype = Object.create(Phaser.Particle.prototype);
    sparkParticle.prototype.constructor = sparkParticle;
    sparkParticle.prototype.onEmit = function(){ 
      this.alpha = 0;
    }

    let bmd = game.add.bitmapData(64, 64);
    let radgrad = bmd.ctx.createRadialGradient(16, 16, 4, 16, 16, 16);

    radgrad.addColorStop(0, 'rgba(247, 146, 32, 1)');
    radgrad.addColorStop(1, 'rgba(247, 146, 32, 0)');

    bmd.context.fillStyle = radgrad;
    bmd.context.fillRect(0, 0, 64, 64);

    game.cache.addBitmapData('particleShade', bmd);

    this.lifetime = 5000;    
    this.emitter = game.add.emitter(game.world.centerX, game.world.height-100, 200);
    this.emitter.width = game.world.width;
    this.emitter.particleClass = sparkParticle;
    this.emitter.makeParticles();
    this.emitter.minParticleSpeed.set(0, 0);
    this.emitter.maxParticleSpeed.set(0, 0);
    this.emitter.setRotation(0, 0);  
    // this.emitter.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
    this.emitter.minParticleScale = 0.1;
    this.emitter.maxParticleScale = 1;
    this.emitter.gravity = -50;

    this.emitter.start(false, this.lifetime, 100);

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
    let emitter = this.emitter
    let fadeInTime = 1000;

    emitter.forEachAlive(function(p){
      let age = emitter.lifespan - p.lifespan
      if(p.lifespan <= emitter.lifespan/ 2) {// Half of lifetime over
        p.alpha= p.lifespan / (emitter.lifespan/2);
      }
      if (p.lifespan > emitter.lifespan - fadeInTime) {
        p.alpha = age/ fadeInTime;
      }
    })
  }
}
