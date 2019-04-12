import Phaser from 'phaser'

export default class Soul {

  constructor (player, asset) {
    this.scale = window.game.global.scale;
    this.unit = window.game.global.unit;
    this.soul = game.add.sprite(player.x ,player.y - this.unit, asset);
    this.soul.scale.setTo(this.scale, this.scale);
    this.soul.enableBody = true;
    window.game.physics.p2.enable(this.soul);
    this.soul.physicsBodyType = Phaser.Physics.P2JS;
    this.soul.body.static = true; //to ensure that the soul only moves when it is obtained
    this.soul.body.setCircle(.8 * this.unit); //Hit Box

    //Collisions for Souls
    let soulCollisionGroup = window.game.physics.p2.createCollisionGroup();
    soulCollisionGroup.mask = 32;
    let baseCollisionGroup = window.game.physics.p2.createCollisionGroup();
    baseCollisionGroup.mask = 64;
    let playerCollisionGroup = window.game.physics.p2.createCollisionGroup();
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
