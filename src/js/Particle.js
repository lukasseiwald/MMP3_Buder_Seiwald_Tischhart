export default class Particle {
	constructor(type, offset = 0, lifetime, amount){
		this.amount = amount;
		this.game = window.game;
		this.lifetime = lifetime;
		this.offset = offset;
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

			this.emitter = this.game.add.emitter(game.world.centerX, this.game.world.height-this.offset, 200);
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
		    this.emitter = game.add.emitter(game.world.centerX, game.world.height-this.offset, 50);
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
		    case 'lava':
		    // let colors = ['0xf4b042', '0xf49d41', '0xf47f41', '0xf44f41'];
		    function FireParticle(game, x, y) {
		      Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('flame'));
		    }

		    FireParticle.prototype = Object.create(Phaser.Particle.prototype);
		    FireParticle.prototype.constructor = FireParticle;
		    // FireParticle.prototype.onEmit = function(){ 
		    //       this.tint = colors[Math.floor(Math.random() * 4)];
		    //     }

		    let pSize = game.world.width / 30;
		    let bmpd = game.add.bitmapData(pSize, pSize);
		    // Create a radial gradient, yellow-ish on the inside, orange
		    // on the outside. Use it to draw a circle that will be used
		    // by the FireParticle class.
		    let grd = bmpd.ctx.createRadialGradient(
		      pSize / 2, pSize /2, 2,
		      pSize / 2, pSize / 2, pSize * 0.5);
		    grd.addColorStop(0, 'rgba(193, 170, 30, 0.6)');
  			grd.addColorStop(1, 'rgba(255, 100, 30, 0.1)');
		    bmpd.ctx.fillStyle = grd;
		    
		    bmpd.ctx.arc(pSize / 2, pSize / 2 , pSize / 2, 0, Math.PI * 2);
		    bmpd.ctx.fill();
		    
		    game.cache.addBitmapData('flame', bmpd);
		    
		    // Generate 250 particles
		    this.emitter = game.add.emitter(game.world.centerX, game.world.height-this.offset, 300);
		    this.emitter.width = game.world.width;
		    this.emitter.particleClass = FireParticle;
		    // Magic happens here, bleding the colors of each particle
		    // generates the bright light effect
		    this.emitter.blendMode = PIXI.blendModes.ADD;
		    this.emitter.makeParticles();
		    this.emitter.minParticleSpeed.set(-1, -4);
		    this.emitter.maxParticleSpeed.set(1, 4);
		    this.emitter.setRotation(0, 0);
		    // Make the flames taller than they are wide to simulate the
		    // effect of flame tongues
		    this.emitter.setScale(1, 8, 1, 5, 12000, Phaser.Easing.Quintic.Out);
		    this.emitter.setAlpha(0, 0.6, 2000, Phaser.Easing.Quadratic.InOut, true);
		    this.emitter.gravity = -1;
		    break;
		}
	}

	startEmitter() {
		this.emitter.start(false, this.lifetime, this.amount);
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