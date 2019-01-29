import Phaser from 'phaser'

export default class Player {

    constructor () {
        this.player = null
    }

    spawnPlayer(x, y, asset, bulletAsset, game, playerCollisionGroup, tilesCollisionGroup , bulletCollisionGroup) {

        this.player = game.add.sprite(x,y,asset, 'Idle_000');
        this.player.enableBody = true;

        //  Enable if for physics. This creates a default rectangular body.
        game.physics.p2.enable(this.player);
        this.player.physicsBodyType = Phaser.Physics.P2JS;

        //  Modifying a few body properties
        this.player.body.setZeroDamping();
        this.player.body.fixedRotation = true;

        this.player.fireRate = 100;
        this.player.nextFire = 0;

        this.player.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
        this.player.animations.add('run', ['Running_000','Running_001','Running_002','Running_003','Running_004','Running_005','Running_006','Running_007','Running_008','Running_009','Running_010','Running_011'], 30, true);
        this.player.animations.add('jump', ['Jump Loop_000','Jump Loop_001','Jump Loop_002','Jump Loop_003','Jump Loop_004','Jump Loop_005'], 20, true);
        this.player.animations.add('slash', ['Slashing_000','Slashing_001','Slashing_002','Slashing_003','Slashing_004','Slashing_005','Slashing_006','Slashing_007','Slashing_008','Slashing_009','Slashing_010','Slashing_011'], 20, false);
        this.player.animations.add('shoot', ['Throwing_000','Throwing_001','Throwing_002','Throwing_003','Throwing_004','Throwing_005','Throwing_006','Throwing_007','Throwing_008','Throwing_009','Throwing_010','Throwing_011'], 20, true);
        this.player.animations.add('hurt', ['Hurt_000','Hurt_001','Hurt_002','Hurt_003','Hurt_004','Hurt_005','Hurt_006','Hurt_007','Hurt_008','Hurt_009','Hurt_010','Hurt_011'], 20, false);
        this.player.animations.add('dying', ['Dying_000','Dying_001','Dying_002','Dying_003','Dying_004','Dying_005','Dying_006','Dying_007','Dying_008','Dying_009','Dying_010','Dying_011','Dying_012','Dying_013','Dying_014'], 20, false);
        this.player.animations.play('idle');

        this.player.anchor.set(0.5, 0.5);

        //Buletts
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.P2JS;
        this.bullets.createMultiple(50, bulletAsset);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        // this.bullets.children.forEach((child)=> {
        //     console.log(child);
        // })

        this.bullets.hash = {
            id: this.player.body.sprite.key
        }

       // console.log(this.bullets.hash["id"]);


        this.bullets.forEach((bullet)=>{
            bullet.body.setCollisionGroup(bulletCollisionGroup);
            bullet.body.collides(playerCollisionGroup);
            bullet.body.collides(tilesCollisionGroup);
            bullet.body.collides(bulletCollisionGroup);
            bullet.body.onBeginContact.add(this.hitPlayer, bullet);
        });

        //Collisions for Player
        this.player.body.setCollisionGroup(playerCollisionGroup);
        this.player.body.collides(tilesCollisionGroup, this.hitTile(), this);
        this.player.body.collides(playerCollisionGroup, this.hitPlayer(), this);

        game.physics.p2.setPostBroadphaseCallback(this.filterCollisions, this);
        this.player.body.collides(bulletCollisionGroup);
        
        return this.player;
    }

    //use a custom "ownerId" value to check if both come from the same entity (player/npc)
    filterCollisions(body1, body2) {
        if((body1.sprite.key === "egyptian" && body2.sprite.key === "bullet") ||
            (body1.sprite.key === "egyptian2" && body2.sprite.key === "bullet2" ) 
            || (body2.sprite.key === "egyptian" && body1.sprite.key === "bullet") ||
            (body2.sprite.key === "egyptian2" && body1.sprite.key === "bullet2" ) 
        ){
            console.log("hapüening");
           return false
        }
        return true;
    }

    hitTile() { }

    hitPlayer(body) {
        console.log(this);
        if(body) {
            if (body.sprite.key == "egyptian") {
                //body.sprite.kill();
                this.body.sprite.kill();
                body.sprite.animations.play('hurt', 10, false);
                if(body.sprite.health > 0.5) {
                    body.sprite.health -= 0.2;
                }
                else {
                    console.log(body.sprite.key + " is dead");
                }
                
            }
            else if (body.sprite.key == "egyptian2"){
                //body.sprite.kill();
                this.body.sprite.kill();
                body.sprite.animations.play('hurt', 10, false);
                if(body.sprite.health > 0.5) {
                    body.sprite.health -= 0.2;
                }
                else {
                    console.log(body.sprite.key + " is dead");
                }
            }
            else if (body.sprite.key == "tileSet") {
                this.body.sprite.kill();
            }
        }
    }

    hitPlayerBullet() {
        console.log("hitting");
    }

    deleteBullet(bullet) {
        bullet.kill();
    }

    idle() {
        if(this.player.animations.name === 'hurt') {
            this.player.animations.killOnComplete;
        }
        else {
            this.player.animations.play('idle');
        }
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
        //this.createBullet(game, collisionGroup, collidingWith);
        if(game.time.now > this.player.nextFire) {
            this.bullet = this.bullets.getFirstExists(false);
            if(this.bullet) {
                
                this.player.animations.play('shoot');

                if(this.player.scale.x < 0) {
                    this.bullet.reset(this.player.x - 20, this.player.y);
                    //this.bullet.body.mass = 1; //Recoil Strength when firing
                    // this.bullet.body.allowGravity = true;
                    // this.bullet.body.immovable = true;
                    this.bullet.body.moveLeft(2000);
                    this.bullet.body.velocity.y = -400;
                }
                else if(this.player.scale.x > 0){
                    this.bullet.reset(this.player.x + 20, this.player.y);
                    this.bullet.body.mass = 10; //Recoil Strength when firing
                    // this.bullet.body.allowGravity = true;
                    // this.bullet.body.immovable = true;
                    this.bullet.body.moveRight(2000);
                    this.bullet.body.velocity.y = -100;
                }
                this.player.nextFire = game.time.now + 900;
            } 
        }
    }

    // createBullet(game, collisionGroup, collidingWith) {

    //     //bullet to left
    //     if(this.player.scale.x < 0) {
    //         this.bullet = game.add.sprite(this.player.x - 100, this.player.y - 20, 'bullet');
    //         this.bullet.enableBody = true;
    //         game.physics.p2.enable(this.bullet);
    //         this.bullet.body.fixedRotation = true;
    //         this.bullet.physicsBodyType = Phaser.Physics.P2JS;
    //         this.bullet.body.setCollisionGroup(collisionGroup);
    //         this.bullet.body.moveLeft(100);
    //     }
    //     //bullet to right
    //     else { 
    //         this.bullet = game.add.sprite(this.player.x + 100, this.player.y - 20, 'bullet');
    //         this.bullet.enableBody = true;
    //         game.physics.p2.enable(this.bullet);
    //         this.bullet.body.fixedRotation = true;
    //         this.bullet.physicsBodyType = Phaser.Physics.P2JS;
    //         this.bullet.body.setCollisionGroup(collisionGroup);
    //         this.bullet.body.moveRight(100);
    //     }

    //     this.bullet.body.collides(collidingWith, this.hitPlayerBullet(this.bullet), this);
    // }
}
