import Phaser from 'phaser'

export default class Soul {

  constructor (player, asset) {
    this.soul = game.add.sprite(player.x ,player.y - 30, asset);
    this.soul.enableBody = true;

    window.game.physics.p2.enable(this.soul);
    this.soul.physicsBodyType = Phaser.Physics.P2JS;
    this.soul.body.static = true; //to ensure that the soul only moves when it is obtained
    this.soul.body.setCircle(16); //Hit Box
   
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
    this.soul.fixedX = true;
    this.soul.fixedY = true;
    this.soul.beingCarried = false;

    this.soul.animations.add('souling');
    this.soul.animations.play('souling', 5, true);
  }
}
