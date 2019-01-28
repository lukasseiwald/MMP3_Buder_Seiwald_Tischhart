/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import lang from '../lang'

export default class extends Phaser.State {
  init() { }

  preload() {
    //this.game.time.advancedTiming = true; //For indicating FPS

    //this.load.spritesheet('tileSet', 'assets/images/tileSet.png', 48, 48, 2);

    this.load.atlasJSONHash('egyptian', '../../assets/characters/egyptian/egyptian.png', '../../assets/characters/egyptian/egyptian.json');
  }

  create() {
    this.airconsole = new AirConsole();

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 4000;

    //  little bouncey
    game.physics.p2.defaultRestitution = 0.2;

    //  Turn on impact events for the world, without this we get no collision callbacks
    game.physics.p2.setImpactEvents(true);

    //  Create our collision groups. One for the player, one for the tiles
    this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
    this.tilesCollisionGroup = game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    this.game.physics.p2.updateBoundsCollisionGroup();

    //Platform
    // this.platforms = this.game.add.physicsGroup();
    // this.platforms.enableBody = true;

    //Tiles
    // this.tiles = this.game.add.physicsGroup();
    // this.tiles.enableBody = true;
    //this.createPlatforms();

    //Players
    // this.players = this.game.add.group();
    // this.players.enableBody = true;
    // this.players.physicsBodyType = Phaser.Physics.P2JS;

    //Player 1
    this.player1 = new Player();
    this.player1.spawnPlayer(600, 600, 'egyptian', this.game.physics.p2, this.players, this.playerCollisionGroup, this.tilesCollisionGroup, false, 820, 10, this.game);

    // this.cursors = this.game.input.keyboard.createCursorKeys();
  }

  update() {
    let player = this.player1;

    this.airconsole.onMessage = function(device_id, data) {
      if(this.player1 !== null) {
        switch(data.action) {
          case 'right':
            player.moveToRight();
            break;
          case 'left':
            player.moveToLeft();
            break;
          case 'jump':
            player.jump();
            break;
          default:
             player.idle()
        }
      }
      else {
        console.log("player is null");
      }
    };
  }

  // updatePlayer() {
  //   if (this.cursors.left.isDown) {
  //     this.player1.moveToLeft();
  //   }
  //   else if (this.cursors.right.isDown)
  //   {
  //   	this.player1.moveToRight();
  //   }
  //   else if (this.cursors.up.isDown)
  //   {
  //   	this.player1.jump();
  //   }
  //   else if (this.cursors.down.isDown)
  //   {
  //   	this.player1.slash();
  //   }
  //   else {
  //     this.player1.idle();
  //   }
  // }

  processHandler (player, tile) {
    return true;
  }

  hitTile() { }

  //To check if Player is close to tile ---> in order to destroying it
  collidingWithTiles(player, tile) {
    if(tile.frame == 1) {
      tile.kill();
    }
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
    //this.game.debug.text('FPS: ' + this.game.time.fps || '--', 20, 20);
  }
}
