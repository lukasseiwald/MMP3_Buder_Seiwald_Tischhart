import Phaser from 'phaser';

export default class Soul {
	constructor (player, asset) {
		this.scale = window.game.global.scale;
		this.unit = window.game.global.unit;
		this.soul = window.game.add.sprite(player.x, player.y - this.unit, asset);
		this.soul.scale.setTo(this.scale, this.scale);
		this.soul.enableBody = true;
		window.game.physics.p2.enable(this.soul);
		this.soul.physicsBodyType = Phaser.Physics.P2JS;
		// to ensure that the soul only moves when it is obtained
		this.soul.body.static = true;
		// Hit Box
		this.soul.body.setCircle(0.8 * this.unit);

		// Collisions for Souls
		const soulCollisionGroup = window.game.physics.p2.createCollisionGroup();
		const baseCollisionGroup = window.game.physics.p2.createCollisionGroup();
		const playerCollisionGroup = window.game.physics.p2.createCollisionGroup();

		soulCollisionGroup.mask = 32;
		baseCollisionGroup.mask = 64;
		playerCollisionGroup.mask = 4;

		this.soul.body.setCollisionGroup(soulCollisionGroup);
		this.soul.body.collides(playerCollisionGroup);
		this.soul.body.collides(baseCollisionGroup, this.basedSoul, this);
		this.soul.body.data.gravityScale = 0;
		this.soul.fixedX = false;
		this.soul.fixedY = false;
		this.soul.beingCarried = false;

		this.soul.animations.add('souling');
		this.soul.animations.play('souling', 5, true);
	}
}
