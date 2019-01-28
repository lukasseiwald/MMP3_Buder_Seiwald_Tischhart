import Phaser from 'phaser'

export default class Player { 
  
    constructor (game) {
        this.game = game;
        this.player = null
    }

    spawnPlayer(x, y, asset) {

        this.player = this.game.add.sprite(x,y,asset, 'Idle_000', this.physics);
        this.player.enableBody = true;

        //  Enable if for physics. This creates a default rectangular body.
        this.physics.enable(this.player, true);
        this.player.physicsBodyType = Phaser.Physics.P2JS;

        //  Modifying a few body properties
        this.player.body.setZeroDamping();
        this.player.body.fixedRotation = true;

        this.player.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);

        this.player.animations.play('idle');

        this.player.anchor.set(0.5, 0.5);
       
        return this.player;
    }
}