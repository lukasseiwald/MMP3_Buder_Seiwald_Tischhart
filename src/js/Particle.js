export default class Particle {
	constructor(){
		this.game = window.game;
		this.lifetime = 5000;
		this.setParticle();
	}

	setParticle() {
		this.sparkParticle = function (game, x, y) {
	      Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));
	    };

	    this.sparkParticle.prototype = Object.create(Phaser.Particle.prototype);
	    this.sparkParticle.prototype.constructor = this.sparkParticle;
	    this.sparkParticle.prototype.onEmit = function(){ 
	      this.alpha = 0;
	    }

	    let bmd = game.add.bitmapData(64, 64);
	    let radgrad = bmd.ctx.createRadialGradient(16, 16, 4, 16, 16, 16);

	    radgrad.addColorStop(0, 'rgba(247, 146, 32, 1)');
	    radgrad.addColorStop(1, 'rgba(247, 146, 32, 0)');

	    bmd.context.fillStyle = radgrad;
	    bmd.context.fillRect(0, 0, 64, 64);

	    this.game.cache.addBitmapData('particleShade', bmd);

		this.emitter = this.game.add.emitter(game.world.centerX, this.game.world.height-100, 200);
	    this.emitter.width = game.world.width;
	    this.emitter.particleClass = this.sparkParticle;
	    this.emitter.makeParticles();
	    this.emitter.minParticleSpeed.set(0, 0);
	    this.emitter.maxParticleSpeed.set(0, 0);
	    this.emitter.setRotation(0, 0);  
	    this.emitter.minParticleScale = 0.1;
	    this.emitter.maxParticleScale = 0.6;
	    this.emitter.gravity = -50;
	}

	startEmitter() {
		this.emitter.start(false, this.lifetime, 100);
	}

	updateVisibility() {
		let emitter = this.emitter
	    let fadeInTime = 1000;

		emitter.forEachAlive(function(p){
	      let age = emitter.lifespan - p.lifespan
	      if(p.lifespan <= emitter.lifespan/ 2) {// fading out
	        p.alpha= p.lifespan / (emitter.lifespan/2);
	      }
	      if (p.lifespan > emitter.lifespan - fadeInTime) {//fading in
	        p.alpha = age/ fadeInTime;
	      }
	    });
	}
}