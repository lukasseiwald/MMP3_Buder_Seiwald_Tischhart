import Phaser from 'phaser'
import Soul from './Soul'

export default class Player {

  constructor (deviceId) {
    this.player = null
    this.deviceId = deviceId;
    window.game.souls = [];
    this.movingTo = null;
    this.jumpCount = 0;
  }

  isGrounded() {
      var yAxis = p2.vec2.fromValues(0, 1);
      var result = false;

      for (var i=0; i < window.game.physics.p2.world.narrowphase.contactEquations.length; i++){
          var c = window.game.physics.p2.world.narrowphase.contactEquations[i];
          if (c.bodyA === this.player.body.data || c.bodyB === this.player.body.data){
              var d = p2.vec2.dot(c.normalA, yAxis);
              if (c.bodyA === this.player.body.data){
                  d *= -1;
              }
              if (d > 0.5){
                  result = true;
              }
          }
      }
      return result;
  }

  move() {
    switch (this.movingTo) {
      case 'right':
        this.moveToRight();
        break;
      case 'left':
        this.moveToLeft();
        break;
      default:
        this.moveSoulWithPlayer();
        this.player.body.moveRight(0);
        this.player.body.moveLeft(0);
    }

    if(this.player.body.y > window.game.height) {
      this.player.body.y = 0;
    }

    if(this.jumpCount > 0 && this.isGrounded()) {
      this.jumpCount = 0;
    }
  }

  idle() {
    this.moveSoulWithPlayer();
    if(this.player.animations.name === 'hurt') {
      this.player.animations.killOnComplete;
    }
    else {
      this.player.animations.play('idle');
    }
  }

  moveToRight() {
    this.player.scale.x = 1; //1 => facing Right
    this.player.animations.play('run');
    this.moveSoulWithPlayer();
    this.player.body.moveLeft(0);
    this.player.body.moveRight(400);
  }

  moveToLeft() {
    this.player.scale.x = -1; //-1 => facing Left
    this.player.animations.play('run');
    this.moveSoulWithPlayer();
    this.player.body.moveRight(0);
    this.player.body.moveLeft(400);
  }

  jump() {
    this.jumpCount += 1;
    this.moveSoulWithPlayer();
    if (this.jumpCount < 2) {
      this.player.animations.play('jump');
      this.player.body.moveUp(1500);
    }
  }

  spawnPlayer(x, y, asset, playerCollisionGroup, tilesCollisionGroup , bulletCollisionGroup, soulCollisionGroup) {

    let spawnX = x;
    let spawnY = y
    if(x > 600) {
      spawnY = spawnY - 300;
    }
    else {
      spawnX = spawnX - 400;
      spawnY = spawnY - 300;
    }
    this.player = window.game.add.sprite(spawnX,spawnY,asset);
    this.player.enableBody = true;
    this.player.death = 100;

    //  Enable if for physics. This creates a default rectangular body.
    window.game.physics.p2.enable(this.player);
    this.player.physicsBodyType = Phaser.Physics.P2JS;

    //  Modifying a few body properties
    this.player.body.setZeroDamping();
    this.player.body.fixedRotation = true;

    //few Player properties
    this.player.spawnPointX = x;
    this.player.spawnPointY = y;
    this.player.fireRate = 100;
    this.player.nextFire = 0;
    this.player.hasEnemySoul = false;
    this.player.carryingSoul = 0;
    this.player.collectedSouls = [this.player.key + '_soul']
    this.player.bulletAsset = this.player.key + '_bullet';
    this.player.soulAsset = this.player.key + '_soul';
    this.player.anchor.set(0.5, 0.5);

    this.player.body.clearShapes();
    this.player.body.addPolygon( {} ,   321, 299  ,  302, 255  ,  317, 230  ,  348, 230  ,  352, 275  ,  348, 300   );

    //Event Listener
    this.player.events.onKilled.add(this.playerDied, this);

    this.player.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
    this.player.animations.add('run', ['Running_000','Running_001','Running_002','Running_003','Running_004','Running_005','Running_006','Running_007','Running_008','Running_009','Running_010','Running_011'], 30, true);
    this.player.animations.add('walk', ['Walking_000','Walking_001','Walking_002','Walking_003','Walking_004','Walking_005','Walking_006','Walking_007','Walking_008','Walking_009','Walking_010','Walking_011','Walking_012','Walking_013','Walking_014','Walking_015','Walking_016','Walking_017','Walking_018','Walking_019','Walking_020','Walking_021','Walking_022','Walking_023'], 30, true);
    this.player.animations.add('jump', ['Jump Loop_000','Jump Loop_001','Jump Loop_002','Jump Loop_003','Jump Loop_004','Jump Loop_005'], 20, true);
    this.player.animations.add('slash', ['Slashing_000','Slashing_001','Slashing_002','Slashing_003','Slashing_004','Slashing_005','Slashing_006','Slashing_007','Slashing_008','Slashing_009','Slashing_010','Slashing_011'], 20, false);
    this.player.animations.add('shoot', ['Throwing_000','Throwing_001','Throwing_002','Throwing_003','Throwing_004','Throwing_005','Throwing_006','Throwing_007','Throwing_008','Throwing_009','Throwing_010','Throwing_011'], 20, false);
    this.player.animations.add('hurt', ['Hurt_000','Hurt_001','Hurt_002','Hurt_003','Hurt_004','Hurt_005','Hurt_006','Hurt_007','Hurt_008','Hurt_009','Hurt_010','Hurt_011'], 20, false);
    //this.player.animations.add('dying', ['Dying_000','Dying_001','Dying_002','Dying_003','Dying_004','Dying_005','Dying_006','Dying_007','Dying_008','Dying_009','Dying_010','Dying_011','Dying_012','Dying_013','Dying_014'], 17, false);
    this.player.animations.play('idle');


     //make Player face right direction
    if(x > 600) {
      this.player.scale.x = -1;
    }

    //Buletts
    this.bullets = window.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.P2JS;
    this.bullets.createMultiple(50, this.player.bulletAsset);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    this.bullets.forEach((bullet)=>{
        //this = bullet
        bullet.body.setCollisionGroup(bulletCollisionGroup);
        bullet.body.collides([playerCollisionGroup, tilesCollisionGroup, bulletCollisionGroup]);
        bullet.body.onBeginContact.add(this.hitPlayer, bullet);
    });

    //Collisions for Player
    this.player.body.setCollisionGroup(playerCollisionGroup);
    this.player.body.collides([tilesCollisionGroup, playerCollisionGroup, bulletCollisionGroup]);
    this.player.body.collides(soulCollisionGroup, this.obtainedSoul, this);
   // this.player.body.collides(baseCollisionGroup, this.inBase, this);

    //this.player.events.onOutOfBounds.add(this.playerTeleport, this);

    window.game.physics.p2.setPostBroadphaseCallback(this.filterCollisions, this);

    return this.player;
  }

  playerTeleport() {
    console.log("telöeport");
    this.player.x = 500;
    this.player.y = 50;
  }

  //pre-check in order to prevent collision of player with its own bullets
  filterCollisions(body1, body2) {
    if(body1.sprite == null || body2.sprite == null) {
      return true;
    }
    else if((body2.sprite.key.includes(body1.sprite.key)) ||
        (body2.sprite.key.includes(body1.sprite.key))
        || (body1.sprite.key.includes(body2.sprite.key))  ||
        (body1.sprite.key.includes(body2.sprite.key)))
      {
        return false
      }
    return true;
  }

  hitPlayer(hitTarget) {
    if(hitTarget) {
      var bullet = this.body.sprite;
      if (hitTarget.sprite.bulletAsset) {
        hitTarget.sprite.animations.play('hurt', 10, false);
        if(hitTarget.sprite.alive) {
            hitTarget.sprite.damage(0.4);
        }
      }
    }
  }

  playerDied() {
    //remove obtained soul of dead player
    if(this.player.obtainedSoul) {
      this.player.obtainedSoul.sprite.kill();
      this.player.carryingSoul = 0;
    }
    //Style of Respawn Counter
    let style = { font: "65px Bungee", fill: "#FFFFFF", align: "center" };
    //Time
    let countdown = 6;

    let text = window.game.add.text(this.player.spawnPointX , this.player.spawnPointY, 5, style);
    let respawnTimer = setInterval(function() {
      countdown = --countdown <= 0 ? 5 : countdown;
      text.setText(countdown - 1);
      if(countdown < 2) {
        clearInterval(respawnTimer);
        text.kill();
      }
    }, 1000);

    window.game.time.events.add(Phaser.Timer.SECOND * 5, this.respawnPlayer, this);
    this.spawnDeadBodyWithSoul();
  }

  respawnPlayer() {
    this.player.reset(this.player.spawnPointX, this.player.spawnPointY);
    this.player.obtainedSoul = null;
  }

  spawnDeadBodyWithSoul() {
    //Spawning dead body just to play its dying animation
    this.deadBody = window.game.add.sprite(this.player.x - 35, this.player.y - 35, this.player.key);
    this.deadBody.animations.add('dying', ['Dying_000','Dying_001','Dying_002','Dying_003','Dying_004','Dying_005','Dying_006','Dying_007','Dying_008','Dying_009','Dying_010','Dying_011','Dying_012','Dying_013','Dying_014'], 17, false);
    this.deadBody.animations.play("dying");
    window.game.time.events.add(Phaser.Timer.SECOND * 5, this.deleteDeadBody, this);

    //Spawning
    this.soul = new Soul();
    this.soul.spawnSoul(this.player, this.player.soulAsset);
    this.soul.fixedX = true;
    this.soul.fixedY = true;
    window.game.souls.push(this.soul);
  }

  deleteDeadBody() {
    this.deadBody.kill();
  }

  slash() {
    this.player.animations.play('slash');
  }

  shoot() {
    if(window.game.time.now > this.player.nextFire && this.player.alive) {
      this.bullet = this.bullets.getFirstExists(false);
      if(this.bullet) {

        this.player.animations.play('shoot');

        if(this.player.scale.x < 0) {
          this.bullet.reset(this.player.x - 20, this.player.y);
          this.bullet.body.moveLeft(1500);
          this.bullet.body.velocity.y = -500;
          this.bullet.lifespan = 1000;
        }
        else if(this.player.scale.x > 0){
          this.bullet.reset(this.player.x + 20, this.player.y);
          this.bullet.body.moveRight(1500);
          this.bullet.body.velocity.y = -500;
          this.bullet.lifespan = 1000;
        }
        this.player.nextFire = window.game.time.now + 900;
      }
    }
  }

  obtainedSoul(player, soul) {
    //check if player already carries a soul and if player already previous obtained the soul

    if(this.player.collectedSouls.includes(soul.sprite.key)) {
      console.log("player has this soul already: " + soul.sprite.key);
      console.log(this.player.collectedSouls);
      soul.sprite.kill();
    }
    if(this.player.carryingSoul === 0) {
      if(!soul.alreadyObtained) {
        this.player.carryingSoul = 1;
        soul.fixedX = false;
        soul.fixedY = false;
        this.player.obtainedSoul = soul;
        this.player.obtainedSoul.alreadyObtained = true;
        this.player.obtainedSoul.obtainedBy = this.player;
        this.player.obtainedSoul.x = this.player.x;
        this.player.obtainedSoul.y = this.player.y - 50;
      }
    }
  }

  moveSoulWithPlayer() {
    if(this.player.obtainedSoul) {
      this.player.obtainedSoul.x = this.player.x;
      this.player.obtainedSoul.y = this.player.y - 50;
    }
  }

  inBase() {
    console.log("in base");
  }
}
