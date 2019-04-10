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

    //PARTICLES

    this.glowingParticles = new Particle("spark", 5000);
    this.glowingParticles.startEmitter();

    this.steamParticles = new Particle("smoke", 8000);
    this.steamParticles.startEmitter();

    let colors = ['0xf4b042', '0xf49d41', '0xf47f41', '0xf44f41'];
    function FireParticle(game, x, y) {
      Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('flame'));
    }

    FireParticle.prototype = Object.create(Phaser.Particle.prototype);
    FireParticle.prototype.constructor = FireParticle;
    // FireParticle.prototype.onEmit = function(){ 
    //       this.tint = colors[Math.floor(Math.random() * 4)];
    //     }

    var pSize = game.world.width / 30;
    var bmpd = game.add.bitmapData(pSize, pSize);
    // Create a radial gradient, yellow-ish on the inside, orange
    // on the outside. Use it to draw a circle that will be used
    // by the FireParticle class.
    var grd = bmpd.ctx.createRadialGradient(
      pSize / 2, pSize /2, 2,
      pSize / 2, pSize / 2, pSize * 0.5);
    grd.addColorStop(0, 'rgba(224, 181, 11, 0.7)');
    grd.addColorStop(1, 'rgba(224, 46, 11, 0.1)');
    bmpd.ctx.fillStyle = grd;
    
    bmpd.ctx.arc(pSize / 2, pSize / 2 , pSize / 2, 0, Math.PI * 2);
    bmpd.ctx.fill();
    
    game.cache.addBitmapData('flame', bmpd);
    
    // Generate 250 particles
    let emitter = game.add.emitter(game.world.centerX, game.world.height-100, 300);
    emitter.width = game.world.width;
    emitter.particleClass = FireParticle;
    // Magic happens here, bleding the colors of each particle
    // generates the bright light effect
    emitter.blendMode = PIXI.blendModes.ADD;
    emitter.makeParticles();
    emitter.minParticleSpeed.set(-1, -4);
    emitter.maxParticleSpeed.set(1, 4);
    emitter.setRotation(0, 0);
    // Make the flames taller than they are wide to simulate the
    // effect of flame tongues
    emitter.setScale(1, 8, 1, 3, 12000, Phaser.Easing.Quintic.Out);
    emitter.setAlpha(0, 0.6, 2000, Phaser.Easing.Quadratic.InOut, true);
    emitter.gravity = -1;
    emitter.start(false, 4000, 1);

    addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

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
