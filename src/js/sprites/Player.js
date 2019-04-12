import Phaser from 'phaser'
import Soul from './Soul'

export default class Player {

  constructor (deviceId, spawnX, spawnY, skin) {
    this.player = null
    this.deviceId = deviceId;

    window.game.souls = [];
    this.movingTo = null;
    this.dashTimer = 0;
    this.dashIdleTimer = 0;
    this.lastDash = 0;
    this.canDash = false;
    this.jumpCount = 0;

    this.spawnX = spawnX;
    this.spawnY = spawnY;
    this.skin = skin;

    this.scale = window.game.global.scale;
    this.unit = window.game.global.unit;
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
        this.moveShieldWithPlayer();
        this.player.body.moveRight(0);
        this.player.body.moveLeft(0);
    }

    if(this.player.body.y > window.game.height) {
      this.player.body.y = 60;
      this.moveSoulWithPlayer();
      if(this.player.obtainedSoul != null) {
        this.player.obtainedSoul.reset(this.player.body.x, this.player.body.y - 50);
      }
    }
    else if(this.player.body.y < 0){
      this.player.body.y = window.game.height - 50;
      this.moveSoulWithPlayer();
      if(this.player.obtainedSoul != null) {
        this.player.obtainedSoul.reset(this.player.body.x, this.player.body.y - 50);
      }
    }
    if(this.player.body.x > window.game.width) {
      this.player.body.x = 40;
      this.moveSoulWithPlayer();
      if(this.player.obtainedSoul != null) {
        this.player.obtainedSoul.reset(this.player.body.x, this.player.body.y - 50);
      }
    }
    else if(this.player.body.x < 0){
      this.player.body.x = window.game.width - 50;
      this.moveSoulWithPlayer();
      if(this.player.obtainedSoul != null) {
        this.player.obtainedSoul.reset(this.player.body.x, this.player.body.y - 50);
      }
    }
    if(this.jumpCount > 0 && this.isGrounded()) {
      this.jumpCount = 0;
    }
  }

  idle() {
    //DASH
    if(Math.abs(window.game.time.totalElapsedSeconds() - this.dashTimer) > 0.3 && Math.abs(window.game.time.totalElapsedSeconds() - this.dashTimer) < 0.85) {
      this.dashIdleTimer = window.game.time.totalElapsedSeconds();
      this.canDash = true;
    }
    //Keep on playing hurt animation
    if(this.player.animations.name === 'hurt') {
      this.player.animations.killOnComplete;
    }
    else {
      this.player.animations.play('idle');
    }
  }

  moveToRight() {
    this.player.scale.x = this.scale; //1 => facing Right
    this.player.animations.play('run');
    this.player.body.moveLeft(0);
    if(this.player.activeItem === 'speed_item') {
      this.player.body.moveRight(800 * this.scale);
    }
    else {
      this.player.body.moveRight(400 * this.scale);
    }
    this.moveSoulWithPlayer();
    this.moveShieldWithPlayer();
    this.dash();
  }

  moveToLeft() {
    this.player.scale.x = -this.scale; //-1 => facing Left
    this.player.animations.play('run');
    this.player.body.moveRight(0);
    if(this.player.activeItem === 'speed_item') {
      this.player.body.moveLeft(800 * this.scale);
    }
    else {
      this.player.body.moveLeft(400 * this.scale);
    }
    this.moveSoulWithPlayer();
    this.moveShieldWithPlayer();
    this.dash();
  }

  dash() {
    this.dashTimer = window.game.time.totalElapsedSeconds();
    if(this.canDash == true && (Math.abs(this.dashTimer - this.dashIdleTimer) < 0.3) && (Math.abs(this.dashTimer - this.lastDash) > 2.5)) {
      let dash_smoke = window.game.add.sprite(this.player.x - 30, this.player.y - 80, 'dash_smoke');
      dash_smoke.scale.setTo(2 * this.scale, 2 * this.scale); //Item Size
      var dash_smoke_animation = dash_smoke.animations.add('smoking');
      dash_smoke_animation.killOnComplete = true;
      if(this.player.scale.x < 0) {
          this.player.body.moveLeft(4800 * this.scale); //multiply with delta time
          dash_smoke.scale.x = - this.scale;
      }
      else if(this.player.scale.x > 0) {
          this.player.body.moveRight(4800 * this.scale);
          dash_smoke.scale.x = this.scale;
      }
      dash_smoke_animation.play(16);
      this.canDash = false;
      this.lastDash = window.game.time.totalElapsedSeconds();
      this.dashTimer = 0;
    }
  }

  jump() {
    this.jumpCount += 1;
    this.moveSoulWithPlayer();
    this.moveShieldWithPlayer();
    if (this.jumpCount < 2) {
      this.player.animations.play('jump');
      if(this.player.activeItem === 'jump_item') {
        this.player.body.moveUp(1900 * this.scale);
      }
      else {
        this.player.body.moveUp(1100 * this.scale);
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
    this.player.scale.setTo(this.scale, this.scale);
    this.player.enableBody = true;

    //  Enable if for physics. This creates a default rectangular body.
    window.game.physics.p2.enable(this.player);
    this.player.physicsBodyType = Phaser.Physics.P2JS;

    //  Modifying a few body properties
    this.player.body.setZeroDamping();
    this.player.body.fixedRotation = true;
    this.player.body.clearShapes();
    this.player.body.addPolygon({}, 321 * this.scale, 299 * this.scale, 302 * this.scale, 255 * this.scale, 317 * this.scale, 230 * this.scale, 348 * this.scale, 230 * this.scale, 363 * this.scale, 255 * this.scale, 348 * this.scale, 300 * this.scale);

    //make player face right direction
    if(this.spawnX > window.game.world.width/2) {
      this.player.scale.x = -this.player.scale.x;
    }

    //few Player properties
    this.player.nextFire = 0;
    this.player.obtainedSoul = null;
    this.player.collectedSouls = [this.player.key + '_soul']
    this.player.bulletAsset = this.player.key + '_bullet';
    this.player.soulAsset = this.player.key + '_soul';
    this.player.activeItem = '';
    this.player.shield = null;
    this.player.deviceId = this.deviceId; //Für Healthbar
    this.player.anchor.set(0.5, 0.5);

    //Event Listener
    this.player.events.onKilled.add(this.died, this);

    this.setAnimations();
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
      bullet.scale.set(this.scale, this.scale);
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
    if(body2.beingCarried == false) {
      return false;
    }
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
    let unit = window.game.global.unit;
    if(hitTarget) {
      if (hitTarget.sprite.bulletAsset) {
        if(hitTarget.sprite.alive) {
          if(hitTarget.sprite.shield != null) {
            hitTarget.sprite.shield.damage(0.50);
            if(hitTarget.sprite.shield.health <= 0) {
              hitTarget.sprite.shield = null;
            }
          }
          else {
            hitTarget.sprite.animations.play('hurt', 10, false);
            hitTarget.sprite.damage(1/3 + .01);
            let healthBar = window.game.global.healthBars[hitTarget.sprite.deviceId];
            if(hitTarget.sprite.health <= 0) {
              window.game.add.tween(healthBar).to( { width: 0 }, 200, Phaser.Easing.Linear.None, true);
            }
            else {
              window.game.add.tween(healthBar).to( { width: (healthBar.width - 2 * unit) }, 200, Phaser.Easing.Linear.None, true);
            }
          }
        }
      }
    }
  }

  died() {
    //remove obtained soul of dead player
    if(this.player.obtainedSoul) {
      this.player.obtainedSoul.sprite.kill();
      this.player.obtainedSoul = null;
      this.player.activeItem = '';
    }
    //Style of Respawn Counter
    let style = { font: 3 * this.unit+ 'px Bungee', fill: "#FFFFFF", align: "center" };

    let counter = 5;
    let text = window.game.add.text(this.spawnX, this.spawnY - .25 * this.unit, '', style);
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
    let healthBar = window.game.global.healthBars[this.deviceId];
    window.game.add.tween(healthBar).to( { width: 6 * this.unit }, 200, Phaser.Easing.Linear.None, true);
    this.player.reset(this.spawnX, this.spawnY);
    this.player.obtainedSoul = null;
  }

  spawnDeadBodyWithSoul() {
    //Spawning dead body just to play its dying animation
    this.deadBody = window.game.add.sprite(this.player.x, this.player.y, this.player.key);
    this.deadBody.anchor.set(0.5, 0.5);
    this.deadBody.scale.setTo(this.scale, this.scale);
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
          bullet.body.moveLeft(1500 * this.scale);
          bullet.body.velocity.y = -500;
        }
        else if(this.player.scale.x > 0){
          bullet.reset(this.player.x + 20, this.player.y);
          bullet.body.moveRight(1500 * this.scale);
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
      if(!soul.beingCarried) {
        soul.sprite.kill();
      }
    }
    else if(this.player.obtainedSoul == null) {
      if(!soul.alreadyObtained) {
        soul.static = false;
        soul.immovable = false;
        soul.moves = true;
        soul.fixedX = false;
        soul.fixedY = false;
        soul.beingCarried = true;
        this.player.obtainedSoul = soul;
        this.player.obtainedSoul.alreadyObtained = true;
        this.player.obtainedSoul.obtainedBy = this.player;
        this.player.obtainedSoul.x = this.player.x;
        this.player.obtainedSoul.y = this.player.y - 50;
      }
    }
    else if(this.player.obtainedSoul != null) {
      soul.sprite.kill();
    }
  }

  moveSoulWithPlayer() {
    if(this.player.obtainedSoul) {
      //this.player.obtainedSoul.reset(this.player.x, this.player.y - 50)
      this.player.obtainedSoul.x = this.player.x;
      this.player.obtainedSoul.y = this.player.y - 50;
    }
  }

  jumpSoulWithPlayer() {
    if(this.player.obtainedSoul) {
      this.player.obtainedSoul.x = this.player.x;
      this.player.obtainedSoul.y = this.player.y - 50;
    }
  }

  moveShieldWithPlayer() {
    if(this.player.shield) {
      this.player.shield.x = this.player.x - 2 * this.unit;
      this.player.shield.y = this.player.y - 2 * this.unit;
    }
  }

  collectedItem(player, item) {
    let collectedItem = item.sprite.key;
    switch (collectedItem) {
      case 'health_item':
        player.sprite.health = 1;
        let healthBar = window.game.global.healthBars[player.sprite.deviceId];
        window.game.add.tween(healthBar).to( { width: 6 * this.unit }, 200, Phaser.Easing.Linear.None, true);
        break;
      case 'shield_item':
        if(player.sprite.shield != null) {
          player.sprite.shield.kill();
        }
        player.sprite.shield = window.game.add.sprite(this.player.x - 2 * this.unit, this.player.y - 2 * this.unit, 'shield_character');
        player.sprite.shield.scale.setTo(this.scale, this.scale);
        player.sprite.shield.enableBody = true;
        break;
      default:
        this.player.activeItem = collectedItem
    }
  }
}
