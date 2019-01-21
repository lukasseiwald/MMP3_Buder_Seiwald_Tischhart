/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import lang from '../lang'

export default class extends Phaser.State {
  init() { }
  preload() {
    this.load.spritesheet('dude', '../../assets/dude.png', 48, 48, 48); 
    this.load.spritesheet('tileSet', 'assets/images/tileSet.png', 48, 48, 2);
  }

  create() {
    this.airconsole = new AirConsole();

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Players
    this.players = this.game.add.group();
    this.players.enableBody = true;

    //Player 1
    this.player1 = this.createPlayer(800, 550, 'dude', false, 650, 5);  //x, y, skin, facingRight?, jump (jumpHeight), velocity (runningSpeed)
    this.player1.enableBody = true;

    //Platform
    this.platforms = this.game.add.physicsGroup();
    this.platforms.enableBody = true;

    //Tiles
    this.tiles = this.game.add.physicsGroup();
    this.tiles.enableBody = true;
    this.createPlatforms();
  }

  update() {
    this.playersUpdate(); 
    let player = this.player1;

    this.airconsole.onMessage = function(device_id, data) {
      // if(data.move !== undefined && this.game.physics.arcade.collide(player, this.tiles, this.collidingWithTiles, this.processHandler, this )) {
      // }
      // else { //normal collide
      //   this.game.physics.arcade.collide(player, this.tiles)
      // }
      // let player = airconsole.convertDeviceIdToPlayerNumber(device_id);
      if (data.move !== undefined && data.move === 'right') {
        player.animations.play('right');
        player.facingRight = true;
        player.x += player.v;
      }
      else if (data.move !== undefined && data.move === 'left') {
        player.animations.play('left');
        player.facingRight = false;
        player.x -= player.v ;
      }
      else
      {
          player.body.velocity.setTo(0, player.body.velocity.y);
          if(player.facingRight) {
             player.animations.play('idleRight');
          }
          else {
            player.animations.play('idleLeft');
          }
      }
    };
  }

  playersUpdate() {
    //Coliding Player with Platform
    this.game.physics.arcade.collide(this.players, this.platforms );
    //Colliding Players
    //this.game.physics.arcade.collide(this.players, this.players );
  }

  processHandler (player, tile) {
    return true;
  }

  //To check if Player is close to tile ---> in order to destroying it
  collidingWithTiles(player, tile) {
    if(tile.frame == 1) {
      tile.kill();
    }
  }

  createPlayer(x,y,skin,facingRight,jump,velocity) {

    var player = this.players.create(x,y, skin);

    //cover floor with tiles
   
    player.body.gravity.y = 500;
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.setSize(28, 45);

    player.j = jump;
    player.v = velocity;
    player.facingRight = facingRight
    player.attack = false;

    player.animations.add('idleRight', [32,33,34,35], 12, true);
    player.animations.add('idleLeft', [0,1,2,3], 12, true);
    player.animations.add('left', [8,9,10,11,12,13,14,15], 12, true);
    player.animations.add('right', [41,42,43,44,45,46,47,48], 12, true);
    player.animations.add('attackRight', [16,17,18,19], 12, false);
    player.animations.add('attackLeft', [20,21,22,23], 12, false);
    player.animations.add('duck', [26,27,28,29,30], 12, true);
    player.animations.add('jump', [37], 20, true);
    player.animations.add('die', [38], 9, true);

    player.animations.play('idleRight');

    return player;
  }

  createPlatforms() {
    //cover floor with tiles
    for(var i = 0; i < this.game.width; i += 30) {
      var ground = this.platforms.create(i, this.game.world.height - 20, 'tileSet', 0);
      ground.body.immovable = true;
    }

    var tileSet = 0;
    var randomNumber;

    for(var i = 0; i < this.game.width; i += 50) {
      for(var j = 0; j < this.game.height - 50; j += 50) {
        randomNumber = Math.floor((Math.random() * 100) + 1);
        if(tileSet > 1) {
          if(randomNumber < 50) { 
            var tile = this.tiles.create(i, j - 20, 'tileSet', 0);
            tile.body.setSize(30, 30);
            tile.body.immovable = true;
          }
          if(tileSet > 4) {
            tileSet = 0;
          }
        }
        if(randomNumber < 10) {
          tileSet += 1;
          var tile = this.tiles.create(i, j - 20, 'tileSet', 1);
          tile.body.setSize(30, 30);
          tile.body.immovable = true;
        }
      }
    }
  }

  render() {
    if (__DEV__) {
      
    }
  }
}
