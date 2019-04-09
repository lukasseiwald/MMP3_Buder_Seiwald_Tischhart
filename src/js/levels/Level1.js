/* globals __DEV__ */
import Phaser from 'phaser'
import Base from '../sprites/Base'
import Player from '../sprites/Player'
import Item from '../sprites/Item'
import {playerConfig} from '../configs/playerConfig'
import { addImage } from '../utils'
import lang from '../lang'
import Particle from '../Particle';

export default class extends Phaser.State {
  init() { }

  preload() {
    this.game.time.advancedTiming = true; //For indicating FPS
  }

  create() {
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.setBoundsToWorld(true, true, false, false);
    this.game.physics.p2.gravity.y = 4000;

    //  little bouncey
    this.game.physics.p2.defaultRestitution = 0.2;

    //  Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true);

    // Create our collision groups.
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();  //Mask: 4
    this.tilesCollisionGroup = this.game.physics.p2.createCollisionGroup();   //Mask: 8
    this.bulletCollisionGroup = this.game.physics.p2.createCollisionGroup();  //Mask: 16
    this.soulCollisionGroup = this.game.physics.p2.createCollisionGroup();    //Mask: 32
    this.baseCollisionGroup = this.game.physics.p2.createCollisionGroup();    //Mask: 64
    this.itemCollisionGroup = this.game.physics.p2.createCollisionGroup();    //Mask: 128

    this.game.physics.p2.updateBoundsCollisionGroup();
    this.game.physics.setBoundsToWorld();

    //Background
    addImage(this, 0, 0, 'background3', this.world.width, this.world.height);
    addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

    //PARTICLES
    this.glowingParticles = new Particle();
    this.glowingParticles.startEmitter();

    //Tiles
    this.tiles = this.game.add.group();
    this.game.physics.p2.enable(this.tiles);
    this.tiles.physicsBodyType = Phaser.Physics.P2JS;

    //create Items ever x seconds
    this.game.time.events.repeat(Phaser.Timer.SECOND * 15, 100, this.createItems, this);
    
    //this.powerItem.spawnItem();
    
    if(window.game.global.dev) {
      //Bases
      this.baseEgyptian = new Base(90, 825, 'egyptian_base');
      this.baseKnight = new Base(this.world.width - 90, 825, 'knight_base');
      this.baseLucifer = new Base(75, 298, 'lucifer_base');
      this.baseKickapoo = new Base(this.world.width - 90, 298, 'kickapoo_base');

      // Player 1
      this.player1 = new Player(1, 200, 500, 'knight');
      this.player1.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);

      // Player 2
      this.player2 = new Player(2, 400, 500, 'egyptian');
      this.player2.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);

      //Player 3
      this.player3 = new Player(3, 600, 500, 'lucifer');
      this.player3.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);

      //Player 4
      this.player4 = new Player(4, 800, 500, 'kickapoo');
      this.player4.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);

      this.cursors = this.game.input.keyboard.createCursorKeys();

      this.wasd = {
        up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
        down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
        left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
      };
    }
    else {
      let characterSettings = [
        {
          skin:'egyptian',
          x: 90,
          y: 842
        },
        {
          skin: 'knight',
          x: this.world.width - 90,
          y: 842
        },
        {
          skin: 'lucifer',
          x: 75,
          y: 313
        },
        {
          skin: 'kickapoo',
          x: this.world.width - 90,
          y: 313
        }
      ]
      let index = 0;

      for (let [deviceId, value] of window.game.global.playerManager.getPlayers()) {
        let character = new Player(deviceId, characterSettings[index].x, characterSettings[index].y, characterSettings[index].skin);
        let base = new Base(characterSettings[index].x, characterSettings[index].y, characterSettings[index].skin + '_base', character);
        character.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);
        window.game.global.playerManager.setCharacter(deviceId, character);
        index += 1;
      }
    }
    this.createMap();
  }

  update() {
    //particle visibility (fading in and out)
    this.glowingParticles.updateVisibility();
    if(window.game.global.dev) {
      this.updatePlayer();
    // this.updatePlayer();
    // this.updatePlayer2();
    }
    else {
      for (let [deviceId, value] of window.game.global.playerManager.getPlayers()) {
        let character = window.game.global.playerManager.getPlayerCharacter(deviceId);
        character.move();
      }

      window.game.global.airConsole.onMessage = function(deviceId, data) {
        let character = window.game.global.playerManager.getPlayerCharacter(deviceId);
        if(character !== null) {
          switch(data.action) {
            case 'right':
              character.moveToRight();
              character.movingTo = 'right';
              break;
            case 'left':
              character.movingTo = 'left';
              break;
            case 'jump':
              character.jump();
              break;
            case 'shoot':
              character.shoot();
              break;
            default:
              character.movingTo = null;
              character.idle()
          }
        }
        else {
          console.info("player is null");
        }
      };
    }
  }

  updatePlayer() {
    this.player1.move();
    if (this.cursors.left.isDown) {
      this.player1.moveToLeft();
      this.player1.movingTo = 'left';
    }
    else if (this.cursors.right.isDown)
    {
      this.player1.moveToRight();
      this.player1.movingTo = 'right';
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
      this.player1.movingTo = null;
    }
  }

  // updatePlayer2() {
  //   if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
  //     this.player2.moveToLeft();
  //   }
  //   else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
  //   {
  //   	this.player2.moveToRight();
  //   }
  //   else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
  //   {
  //   	this.player2.jump();
  //   }
  //   else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
  //   {
  //   	this.player2.shoot(this.game, this.bulletCollisionGroup, this.playerCollisionGroup);
  //   }
  //   else {
  //     this.player2.idle();
  //   }
  // }

  createMap() {
    var map = {
      cols: 56,
      rows: 30,
      tsize: 33,
      tiles: [
        2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 2, 7, 0, 0, 0, 0, 0, 4, 2, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 4, 7, 0, 0, 0, 0, 4, 2, 2, 5, 2, 2, 2, 6, 2, 2, 7, 0, 0, 0, 0, 4, 7, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5, 0, 0, 0, 0, 0, 0, 0, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2
      ],
      getTile(col, row) {
        return this.tiles[row * map.cols + col]
      }
    };

    for (var c = 0; c < map.cols; c++) {
      for (var r = 0; r < map.rows; r++) {
        var tile = map.getTile(c, r);

        if (tile !== 0) { // 0 => empty tile
          var collisionTile = this.game.add.sprite(c * map.tsize, r * map.tsize, 'tiles', tile -1);
          this.game.physics.p2.enable(collisionTile); // enable(collisionTile, true);  too see box
          collisionTile.body.static = true;

          collisionTile.body.clearShapes();
          switch (tile) {
            case 1:
              collisionTile.body.addPolygon( {} , 10, 31  ,  4, 32  ,  32, 3  ,  32, 9     );
              break;
            case 2:
              collisionTile.body.addPolygon( {} ,   1, 33  ,  1, 3  ,  32, 3  ,  32, 33   );
              break;
            case 3:
              collisionTile.body.addPolygon( {} ,     24, 31  ,  2, 8  ,  2, 2  ,  32, 32 );
              break;
            case 4:
              collisionTile.body.addPolygon( {} ,   28, 5  ,  28, 33  ,  10, 33  ,  2, 5  );
              break;
            case 5:
              collisionTile.body.addPolygon( {} ,    1, 33  ,  1, 3  ,  32, 3  ,  32, 33  );
              break;
            case 6:
              collisionTile.body.addPolygon( {} ,    1, 33  ,  1, 3  ,  32, 3  ,  32, 33  );
              break;
            case 7:
              collisionTile.body.addPolygon( {} ,   22, 33  ,  4, 33  ,  4, 5  ,  31, 5  );
              break;
            default:
              collisionTile.body.addPolygon( {} ,    0, 33  ,  0, 0  ,  33, 0  ,  33, 33  );
          }

          collisionTile.body.setCollisionGroup(this.tilesCollisionGroup);
          collisionTile.body.collides([this.playerCollisionGroup, this.bulletCollisionGroup]);
        }
      }
    }
  }

  createItems() {
    this.powerItem = new Item();
  }

  render() {
    this.game.debug.text('FPS: ' + this.game.time.fps || '--', 20, 20);
  }
}
