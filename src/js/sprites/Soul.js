import Phaser from 'phaser'

export default class Soul {

  constructor () {
    this.soul = null
  }

  spawnSoul(player, asset) {

    this.soul = game.add.sprite(player.x ,player.y - 30, asset);
    this.soul.enableBody = true;

    window.game.physics.p2.enable(this.soul);
    this.soul.physicsBodyType = Phaser.Physics.P2JS;
   
    //Collisions for Souls
    let soulCollisionGroup = window.game.physics.p2.createCollisionGroup();
    soulCollisionGroup.mask = 32;
    let playerCollisionGroup = window.game.physics.p2.createCollisionGroup();
    playerCollisionGroup.mask = 4;

    this.soul.body.setCollisionGroup(soulCollisionGroup);
    this.soul.body.collides(playerCollisionGroup, this.collectedSoul, this);

    this.soul.animations.add('souling', [1,2,3], 10, true);
    this.soul.animations.play('souling');

    this.soul.isPickedUp = false;
    this.soul.isLost = false;
    //this.soul.body.static = true;
    this.soul.body.data.gravityScale = 0;
    //this.soul.lifespan = 20000; //Souls last for 20 seconds
  }
}