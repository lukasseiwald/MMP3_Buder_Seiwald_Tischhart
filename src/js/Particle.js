export default class Particle {
	constructor(type, lifetime){
		this.game = window.game;
		this.lifetime = lifetime;
		this.setParticle(type);
	}

	setParticle(type) {
		switch(type) {
			case 'spark':
			this.sparkParticle = function (game, x, y) {
		      Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));
		    };

		    let colors = ['0xf4b042', '0xf49d41', '0xf47f41', '0xf44f41'];
		    this.sparkParticle.prototype = Object.create(Phaser.Particle.prototype);
		    this.sparkParticle.prototype.constructor = this.sparkParticle;
		    this.sparkParticle.prototype.onEmit = function(){ 
		      this.alpha = 0;
		      this.tint = colors[Math.floor(Math.random() * 4)];
		    }


		    let bmd = game.add.bitmapData(64, 64);
		    let radgrad = bmd.ctx.createRadialGradient(16, 16, 4, 16, 16, 16);

		    radgrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
		    radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

		    bmd.context.fillStyle = radgrad;
		    bmd.context.fillRect(0, 0, 64, 64);

		    this.game.cache.addBitmapData('particleShade', bmd);

			this.emitter = this.game.add.emitter(game.world.centerX, this.game.world.height-30, 200);
		    this.emitter.width = game.world.width;

		    // settings
		    this.emitter.particleClass = this.sparkParticle;
		    this.emitter.minParticleSpeed.set(0, 0);
		    this.emitter.maxParticleSpeed.set(0, 0);
		    this.emitter.setRotation(0, 0);  
		    this.emitter.minParticleScale = 0.1;
		    this.emitter.maxParticleScale = 0.6;
		    this.emitter.gravity = -50;

		    // Start the emitter
		    this.emitter.makeParticles();
		    break;
		    case 'smoke':
		    // Create a particle emitter along the bottom of the stage
		    this.emitter = game.add.emitter(game.world.centerX, game.world.height-150, 50);
		    this.emitter.width = game.width-50;
		    
		    // settings
		    this.emitter.minParticleScale = 0.1;
		    this.emitter.maxParticleScale = 0.9;
		    this.emitter.minRotation = -5;
		    this.emitter.maxRotation = 5;
		    this.emitter.setYSpeed(-2, -5);
		    this.emitter.setXSpeed(10, 20);
		    this.emitter.gravity = -10;
		    this.emitter.setAlpha(0, 0.2, this.lifetime/2, Phaser.Easing.Quadratic.InOut, true);
		    
		    // Start the emitter
		    this.emitter.makeParticles('smoke');
		    break;
		}
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