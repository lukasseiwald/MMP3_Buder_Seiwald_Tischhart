import Phaser from 'phaser'
import Soul from './Soul'

export default class Player {

  constructor (deviceId, spawnX, spawnY, skin) {
    this.player = null
    this.deviceId = deviceId;

    window.game.souls = [];
    this.movingTo = null;
    this.jumpCount = 0;

    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.skin = skin;
  }

  isGrounded() {
    let yAxis = p2.vec2.fromValues(0, 1);
    let result = false;

    for (let i=0; i < window.game.physics.p2.world.narrowphase.contactEquations.length; i++){
      let c = window.game.physics.p2.world.narrowphase.contactEquations[i];
      if (c.bodyA === this.player.body.data || c.bodyB === this.player.body.data){
        let d = p2.vec2.dot(c.normalA, yAxis);
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

  //is getting called in update method
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

    if(this.player.body.y > window.game.height - 10) {
      this.player.body.y = 0;
    }
    else if(this.player.body.y < 0){
      this.player.body.y = window.game.height;
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
    if(this.player.activeItem === 'speed_item') {
      this.player.body.moveRight(800);
    }
    else {
      this.player.body.moveRight(400);
    }
  }

  moveToLeft() {
    this.player.scale.x = -1; //-1 => facing Left
    this.player.animations.play('run');
    this.moveSoulWithPlayer();
    this.player.body.moveRight(0);
    if(this.player.activeItem === 'speed_item') {
      this.player.body.moveLeft(800);
    }
    else {
      this.player.body.moveLeft(400);
    }
  }

  jump() {
    this.jumpCount += 1;
    this.moveSoulWithPlayer();
    if (this.jumpCount < 2) {
      this.player.animations.play('jump');
      if(this.player.activeItem === 'jump_item') {
        this.player.body.moveUp(1900);
      }
      else {
        this.player.body.moveUp(1100);
      }
    }
  }

  setAnimations() {
    this.player.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
    this.player.animations.add('run', ['Running_000','Running_001','Running_002','Running_003','Running_004','Running_005','Running_006','Running_007','Running_008','Running_009','Running_010','Running_011'], 30, true);
    this.player.animations.add('walk', ['Walking_000','Walking_001','Walking_002','Walking_003','Walking_004','Walking_005','Walking_006','Walking_007','Walking_008','Walking_009','Walking_010','Walking_011','Walking_012','Walking_013','Walking_014','Walking_015','Walking_016','Walking_017','Walking_018','Walking_019','Walking_020','Walking_021','Walking_022','Walking_023'], 30, true);
    this.player.animations.add('jump', ['Jump Loop_000','Jump Loop_001','Jump Loop_002','Jump Loop_003','Jump Loop_004','Jump Loop_005'], 20, true);
    this.player.animations.add('slash', ['Slashing_000','Slashing_001','Slashing_002','Slashing_003','Slashing_004','Slashing_005','Slashing_006','Slashing_007','Slashing_008','Slashing_009','Slashing_010','Slashing_011'], 20, false);
    this.player.animations.add('shoot', ['Throwing_000','Throwing_001','Throwing_002','Throwing_003','Throwing_004','Throwing_005','Throwing_006','Throwing_007','Throwing_008','Throwing_009','Throwing_010','Throwing_011'], 20, false);
    this.player.animations.add('hurt', ['Hurt_000','Hurt_001','Hurt_002','Hurt_003','Hurt_004','Hurt_005','Hurt_006','Hurt_007','Hurt_008','Hurt_009','Hurt_010','Hurt_011'], 20, false);
  }

  spawnPlayer(playerCollisionGroup, tilesCollisionGroup , bulletCollisionGroup, soulCollisionGroup) {
    this.player = window.game.add.sprite(0,0,this.skin);
    this.player.anchor.set(0.5, 0.5);
    this.player.enableBody = true;

    //  Enable if for physics. This creates a default rectangular body.
    window.game.physics.p2.enable(this.player);
    this.player.physicsBodyType = Phaser.Physics.P2JS;

    //  Modifying a few body properties
    this.player.body.setZeroDamping();
    this.player.body.fixedRotation = true;
    this.player.body.clearShapes();
    this.player.body.addPolygon({}, 321, 299, 302, 255, 317, 230, 348, 230, 352, 275, 348, 300);

    //make player face right direction
    if(this.spawnX > window.game.world.width/2) {
      this.player.scale.x = -1;
    }

    //few Player properties
    this.player.nextFire = 0;
    this.player.carryingSoul = 0;
    this.player.collectedSouls = [this.player.key + '_soul']
    this.player.bulletAsset = this.player.key + '_bullet';
    this.player.soulAsset = this.player.key + '_soul';
    this.player.activeItem = '';
    this.player.anchor.set(0.5, 0.5);

    //Event Listener
    this.player.events.onKilled.add(this.died, this);

    this.player.animations.add('idle', ['Idle_000','Idle_001','Idle_002','Idle_003','Idle_004','Idle_005','Idle_006','Idle_007','Idle_008','Idle_009','Idle_010','Idle_011','Idle_012','Idle_013','Idle_014','Idle_015','Idle_016','Idle_017',], 18, true);
    this.player.animations.add('run', ['Running_000','Running_001','Running_002','Running_003','Running_004','Running_005','Running_006','Running_007','Running_008','Running_009','Running_010','Running_011'], 30, true);
    this.player.animations.add('walk', ['Walking_000','Walking_001','Walking_002','Walking_003','Walking_004','Walking_005','Walking_006','Walking_007','Walking_008','Walking_009','Walking_010','Walking_011','Walking_012','Walking_013','Walking_014','Walking_015','Walking_016','Walking_017','Walking_018','Walking_019','Walking_020','Walking_021','Walking_022','Walking_023'], 30, true);
    this.player.animations.add('jump', ['Jump Loop_000','Jump Loop_001','Jump Loop_002','Jump Loop_003','Jump Loop_004','Jump Loop_005'], 20, true);
    this.player.animations.add('slash', ['Slashing_000','Slashing_001','Slashing_002','Slashing_003','Slashing_004','Slashing_005','Slashing_006','Slashing_007','Slashing_008','Slashing_009','Slashing_010','Slashing_011'], 20, false);
    this.player.animations.add('shoot', ['Throwing_000','Throwing_001','Throwing_002','Throwing_003','Throwing_004','Throwing_005','Throwing_006','Throwing_007','Throwing_008','Throwing_009','Throwing_010','Throwing_011'], 20, false);
    this.player.animations.add('hurt', ['Hurt_000','Hurt_001','Hurt_002','Hurt_003','Hurt_004','Hurt_005','Hurt_006','Hurt_007','Hurt_008','Hurt_009','Hurt_010','Hurt_011'], 20, false);
  
    this.player.animations.play('idle');

    //bullets
    this.bullets = window.game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.P2JS;
    this.bullets.createMultiple(50, this.player.bulletAsset);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    this.bullets.forEach((bullet)=>{
      bullet.body.setCollisionGroup(bulletCollisionGroup);
      bullet.body.collides([playerCollisionGroup, tilesCollisionGroup, bulletCollisionGroup]);
      bullet.body.onBeginContact.add(this.hit, bullet);
    });

    //collisions for Player
    this.player.body.setCollisionGroup(playerCollisionGroup);
    let itemCollisionGroup = window.game.physics.p2.createCollisionGroup();
    itemCollisionGroup.mask = 128;
    this.player.body.collides([tilesCollisionGroup, playerCollisionGroup, bulletCollisionGroup]);
    this.player.body.collides(soulCollisionGroup, this.obtainedSoul, this);
    this.player.body.collides(itemCollisionGroup, this.collectedItem, this);

    //this.player.events.onOutOfBounds.add(this.playerTeleport, this);

    window.game.physics.p2.setPostBroadphaseCallback(this.filterCollisions, this);

    //reset spawn point because player spawned wrong previously
    this.player.reset(this.spawnX, this.spawnY);
  }

  filterCollisions(body1, body2) {
    //check if player collides with own bullet
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

  hit(hitTarget) {
    if(hitTarget) {
      let bullet = this.body.sprite;
      if (hitTarget.sprite.bulletAsset) {
        hitTarget.sprite.animations.play('hurt', 10, false);
        if(hitTarget.sprite.alive) {
            hitTarget.sprite.damage(0.4);
        }
      }
    }
  }

  died() {
    //remove obtained soul of dead player
    if(this.player.obtainedSoul) {
      this.player.obtainedSoul.sprite.kill();
      this.player.carryingSoul = 0;
    }
    //Style of Respawn Counter
    let style = { font: "65px Bungee", fill: "#FFFFFF", align: "center" };

    let counter = 5;
    let text = window.game.add.text(this.spawnX , this.spawnY, '', style);
    let respawnTimer = setInterval(() => {
      text.setText(counter);
      if(counter < 1) {
        clearInterval(respawnTimer);
        text.kill();
        this.respawn();
      }
      counter = counter - 1;
    }, 1000);

    this.spawnDeadBodyWithSoul();
  }

  respawn() {
    this.player.reset(this.spawnX, this.spawnY);
    this.player.obtainedSoul = null;
  }

  spawnDeadBodyWithSoul() {
    //Spawning dead body just to play its dying animation
    this.deadBody = window.game.add.sprite(this.player.x - 35, this.player.y - 35, this.player.key);
    this.deadBody.animations.add('dying', ['Dying_000','Dying_001','Dying_002','Dying_003','Dying_004','Dying_005','Dying_006','Dying_007','Dying_008','Dying_009','Dying_010','Dying_011','Dying_012','Dying_013','Dying_014'], 17, false);
    this.deadBody.animations.play('dying');
    window.game.time.events.add(Phaser.Timer.SECOND * 6, this.deleteDeadBody, this);

    //spawn soul
    this.soul = new Soul(this.player, this.player.soulAsset);
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
      let bullet = this.bullets.getFirstExists(false);
      if(bullet) {

        this.player.animations.play('shoot');

        if(this.player.scale.x < 0) {
          bullet.reset(this.player.x - 20, this.player.y);
          bullet.body.moveLeft(1500);
          bullet.body.velocity.y = -500;
        }
        else if(this.player.scale.x > 0){
          bullet.reset(this.player.x + 20, this.player.y);
          bullet.body.moveRight(1500);
          bullet.body.velocity.y = -500;
        }
        bullet.lifespan = 1000;
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

  collectedItem(player, item) {
    let collectedItem = item.sprite.key;
    switch (collectedItem) {
      case 'health_item':
        player.sprite.health = 200;
        break;
      default:
        this.player.activeItem = collectedItem
    }
  }

  inBase() {
    console.log("in base");
  }
}