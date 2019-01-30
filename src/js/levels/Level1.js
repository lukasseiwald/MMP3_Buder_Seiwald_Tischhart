/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'
import lang from '../lang'

export default class extends Phaser.State {
  init() { }

  preload() {

    this.game.time.advancedTiming = true; //For indicating FPS
    this.load.spritesheet('tileSet', '../../assets/tiles/vulcanoTilesS.png', 66, 66, 3);

    this.load.atlasJSONHash('egyptian', '../../assets/characters/egyptian/egyptian.png', '../../assets/characters/egyptian/egyptian.json');
    this.load.atlasJSONHash('egyptian2', '../../assets/characters/egyptian/egyptian.png', '../../assets/characters/egyptian/egyptian.json');

    this.load.spritesheet('soul', '../../assets/characters/egyptian/egyptian_soul.png', 32, 32, 3);

    this.load.image('bullet', '../../assets/characters/egyptian/egyptian_bullet.png');
    this.load.image('bullet2', '../../assets/characters/egyptian/egyptian_bullet.png');
  }

  create() {

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 4000;

    //  little bouncey
    this.game.physics.p2.defaultRestitution = 0.2;

    //  Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true);

    //  Create our collision groups. One for the player, one for the tiles
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.tilesCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.bulletCollisionGroup = this.game.physics.p2.createCollisionGroup();
    this.soulCollisionGroup = this.game.physics.p2.createCollisionGroup();

    this.game.physics.p2.updateBoundsCollisionGroup();

    //Platform
    this.platforms = this.game.add.physicsGroup();
    this.platforms.enableBody = true;

    //Tiles
    this.tiles = this.game.add.group();
    this.tiles.enableBody = true;
    this.tiles.physicsBodyType = Phaser.Physics.P2JS;
    this.createPlatforms();

    let x = 120;
    let y = 120;

    for (let [deviceId, value] of window.game.global.playerManager.getPlayers()) {
      let character = new Player();
      character.spawnPlayer(x, y, 'egyptian', 'bullet', this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup);
      // window.game.global.players.set(deviceId, {
      //   nickname: value.nickname,
      //   player: player
      // });
      window.game.global.playerManager.setCharacter(deviceId, character);

      x += 100;
      y +=100;
    }

    //Player 1
    this.player1 = new Player();
    this.player1.spawnPlayer(1360, 650, 'egyptian', 'bullet', this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup);

    //Player 2
    this.player2 = new Player();
    this.player2.spawnPlayer(50, 650, 'egyptian2', 'bullet2', this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup);

    //Player 3
    // this.player3 = new Player();
    // this.player3.spawnPlayer(1360, 50, 'skin3', 'bullet3', this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup);

    //Player 4
    // this.player3 = new Player();
    // this.player3.spawnPlayer(50, 50, 'skin4', 'bullet3', this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.wasd = {
      up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };
  }

  update() {
    //this.updatePlayer();
    //this.updatePlayer2();

    //let player = this.player1;

    window.game.global.airConsole.onMessage = function(deviceId, data) {
      let character = window.game.global.playerManager.getPlayerCharacter(deviceId);
      if(character !== null) {
        switch(data.action) {
          case 'right':
            character.moveToRight();
            break;
          case 'left':
            character.moveToLeft();
            break;
          case 'jump':
            character.jump();
            break;
          case 'shoot':
            character.shoot();
            break;
          default:
             character.idle()
        }
      }
      else {
        console.log("player is null");
      }
    };
  }

  updatePlayer() {
    if (this.cursors.left.isDown) {
      this.player1.moveToLeft();
    }
    else if (this.cursors.right.isDown)
    {
    	this.player1.moveToRight();
    }
    else if (this.cursors.up.isDown)
    {
    	this.player1.jump();
    }
    else if (this.cursors.down.isDown)
    {
    	this.player1.shoot();
    }
    else {
      this.player1.idle();
    }
  }

  updatePlayer2() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      this.player2.moveToLeft();
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
    	this.player2.moveToRight();
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
    	this.player2.jump();
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
    	this.player2.shoot(this.game, this.bulletCollisionGroup, this.playerCollisionGroup);
    }
    else {
      this.player2.idle();
    }
  }

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
    for(var i = 0; i < this.game.width; i += 66) {
      var ground = this.platforms.create(i, this.game.world.height - 66, 'tileSet', 0);
      ground.body.static = true;
    }

    var tileSet = 0;
    var randomNumber;

    for(var i = 0; i < this.game.width; i += 66) {
      for(var j = 0; j < this.game.height - 66; j += 66) {
        randomNumber = Math.floor((Math.random() * 100) + 1);
        if(tileSet > 1) {
          if(randomNumber < 15) {
            var tile = this.tiles.create(i, j - 66, 'tileSet', 0);
            tile.body.setCollisionGroup(this.tilesCollisionGroup);
            tile.body.collides([this.tilesCollisionGroup, this.playerCollisionGroup, this.bulletCollisionGroup]);
            //tile.body.setSize(30, 30);
            tile.body.fixedRotation = true;
            tile.body.static = true;
          }
          if(tileSet > 4) {
            tileSet = 0;
          }
        }
        if(randomNumber < 10) {
          tileSet += 1;
          var tile = this.tiles.create(i, j - 66, 'tileSet', 1);
          tile.body.setCollisionGroup(this.tilesCollisionGroup);
          tile.body.collides([this.tilesCollisionGroup, this.playerCollisionGroup, this.bulletCollisionGroup]);
          //tile.body.setSize(30, 30);
          tile.body.fixedRotation = true;
          tile.body.static = true;
        }
      }
    }
  }

  render() {
    this.game.debug.text('FPS: ' + this.game.time.fps || '--', 20, 20);
  }
}
