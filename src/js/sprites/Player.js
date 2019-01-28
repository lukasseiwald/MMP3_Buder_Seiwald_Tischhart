import Phaser from 'phaser'

export default class Player { 
  
    constructor () {
        this.player = null
    }

    spawnPlayer(x, y, asset, game, collisionGroup, collidingWith, facingRight, jump, velocity) {

        this.player = game.add.sprite(x,y,asset, 'Idle_000');
        this.player.enableBody = true;

        //  Enable if for physics. This creates a default rectangular body.
        game.physics.p2.enable(this.player);
        this.player.physicsBodyType = Phaser.Physics.P2JS;

        //  Modifying a few body properties
        this.player.body.setZeroDamping();
        this.player.body.fixedRotation = true;

        this.player.body.setCollisionGroup(collisionGroup);
        this.player.body.collides(collidingWith, this.hitTile(), this);
        this.player.body.collides(collisionGroup, this.hitPlayer(), this);

        this.player.j = jump;
        this.player.v = velocity;
        this.player.facingRight = facingRight
        this.player.attack = false;

        this.player.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
        this.player.animations.add('run', ['Running_000','Running_001','Running_002','Running_003','Running_004','Running_005','Running_006','Running_007','Running_008','Running_009','Running_010','Running_011'], 30, true);
        this.player.animations.add('jump', ['Jump Loop_000','Jump Loop_001','Jump Loop_002','Jump Loop_003','Jump Loop_004','Jump Loop_005'], 20, true);
        this.player.animations.add('slash', ['Slashing_000','Slashing_001','Slashing_002','Slashing_003','Slashing_004','Slashing_005','Slashing_006','Slashing_007','Slashing_008','Slashing_009','Slashing_010','Slashing_011'], 20, false);
        this.player.animations.add('shoot', ['Throwing_000','Throwing_001','Throwing_002','Throwing_003','Throwing_004','Throwing_005','Throwing_006','Throwing_007','Throwing_008','Throwing_009','Throwing_010','Throwing_011'], 20, false);

        this.player.animations.play('idle');

        this.player.anchor.set(0.5, 0.5);
       
        return this.player;
    }

    hitTile() { }

    hitPlayer() { 
        console.log("colliding with player");
    }

    idle() {
        this.player.animations.play('idle');
    }

    moveToRight() {
        this.player.scale.x = 1; //1 => facing Right
        this.player.body.setZeroVelocity();
        this.player.animations.play('run');
        this.player.body.moveRight(400);
    }

    moveToLeft() {
        this.player.scale.x = -1; //-1 => facing Left
        this.player.body.setZeroVelocity();
        this.player.animations.play('run');
        this.player.body.moveLeft(400);
    }

    jump() {
        this.player.body.setZeroVelocity();
        this.player.animations.play('jump');
        this.player.body.moveUp(400);
    }

    slash() {
        this.player.animations.play('slash');
    }

    shoot(game, collisionGroup, collidingWith) {
        this.createBullet(game, collisionGroup, collidingWith);
        this.player.animations.play('shoot');
    }

    createBullet(game, collisionGroup, collidingWith) {
        this.bullet = game.add.sprite(this.player.x, this.player.y, 'bullet');
        this.bullet.enableBody = true;
        game.physics.p2.enable(this.bullet);
        this.bullet.body.fixedRotation = true;
        this.bullet.physicsBodyType = Phaser.Physics.P2JS;

        if(this.player.scale.x < 0) {
            this.bullet.body.moveLeft(100);
        }
        else {
            this.bullet.body.moveRight(100);
        }
        this.bullet.body.setCollisionGroup(collisionGroup);
        
        this.bullet.body.collides(collidingWith, this.hitPlayer(this.bullet), this);
    }
}