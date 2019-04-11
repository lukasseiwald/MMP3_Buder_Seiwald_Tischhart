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
  init() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    let ratio = this.width/this.height;
    // 1.8064 is the ratio with that the map was created
    if(ratio > 1.8064) {
      this.scale.setGameSize(this.height * 1.8064, this.height);
    }
    else {
      this.scale.setGameSize(this.width, this.width/1.8064);
    }
  }

  preload() {
    this.game.time.advancedTiming = true; //For indicating FPS
  }

  create() {
    this.game.camera.roundPixels = true;

    const map = {
      cols: 56, //1848
      rows: 31, //1023
      tsize: 33,
      tiles: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 6, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 6, 2, 7, 0, 0, 0, 0, 0, 0, 4, 2, 5, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 7, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 4, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 4, 2, 2, 2, 5, 10, 10, 10, 10, 6, 2, 2, 2, 7, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10],
      getTile(col, row) {
        return this.tiles[row * map.cols + col]
      }
    };
    map.tsize = this.width/map.cols;

    const characterSettings = [
      {
        skin:'egyptian',
        x: map.tsize * 5,
        y: map.tsize * 26,
        baseX: 3 * map.tsize,
        baseY: this.world.height - 3.5 * map.tsize
      },
      {
        skin: 'knight',
        x: this.world.width - 90,
        y: map.tsize * 26,
        baseX: this.world.width - 3 * map.tsize,
        baseY: this.world.height - 3.5 * map.tsize
      },
      {
        skin: 'lucifer',
        x: map.tsize * 3,
        y: map.tsize * 10,
        baseX: 3 * map.tsize,
        baseY: map.tsize * 9.5
      },
      {
        skin: 'kickapoo',
        x: this.world.width - 90,
        y: map.tsize * 10,
        baseX: this.world.width - 3 * map.tsize,
        baseY: map.tsize * 9.5
      }
    ]

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

    //IMAGES
    this.bg3 = addImage(this, 0, 0, 'background3', this.world.width, this.world.height);

    //PARTICLES

    this.glowingParticles = new Particle("spark", 30, 5000, 100);
    this.glowingParticles.startEmitter();

    // this.steamParticles = new Particle("smoke", 150, 8000, 100);
    // this.steamParticles.startEmitter();

    this.bg2 = addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

    // this.lavaParticles = new Particle("lava", 0, 4000, 1);
    // this.lavaParticles.startEmitter();

    //Tiles
    this.tiles = this.game.add.group();
    this.game.physics.p2.enable(this.tiles);
    this.tiles.physicsBodyType = Phaser.Physics.P2JS;

    //create Items ever x seconds
    let itemPositions = [{x: 400, y: 500}, {x: 530, y: 200}, {x: 200, y: 150}, {x: 600, y: 850}, {x: 700, y: 450}, {x: window.game.world.width - 430, y: 500}, {x: window.game.world.width - 560, y: 200}, {x: window.game.world.width - 230, y: 150}, {x: window.game.world.width - 630, y: 850}, {x: window.game.world.width - 730, y: 450}, {x: window.game.world.width / 2, y: 100}, {x: window.game.world.width / 2, y: 640}, {x: window.game.world.width / 2, y: 310}];
    this.game.global.itemPositions = this.shuffle(itemPositions);
    this.game.time.events.repeat(Phaser.Timer.SECOND * 18, 100, this.createItems, this);

    //HealthBar
    let bmd = this.game.add.bitmapData(100, 20);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, 100, 20);
    bmd.ctx.fillStyle = '#850015';
    bmd.ctx.fill();

    let widthLife = new Phaser.Rectangle(0, 0, bmd.width, bmd.height);


    if(window.game.global.dev) {
      //Bases
      this.baseEgyptian = new Base(map.tsize, characterSettings[0].baseX, characterSettings[0].baseY, characterSettings[0].skin + '_base');
      this.baseKnight = new Base(map.tsize, characterSettings[1].baseX, characterSettings[1].baseY, characterSettings[1].skin + '_base');
      this.baseLucifer = new Base(map.tsize, characterSettings[2].baseX, characterSettings[2].baseY, characterSettings[2].skin + '_base');
      this.baseKickapoo = new Base(map.tsize, characterSettings[3].baseX, characterSettings[3].baseY, characterSettings[3].skin + '_base');

      // Player 1
      this.player1 = new Player(1, characterSettings[0].x, characterSettings[0].y, characterSettings[0].skin);
      let p1HealthBar = this.game.add.sprite(characterSettings[0].x - 50, characterSettings[0].y - 100, bmd);
      p1HealthBar.cropEnabled = true;
      p1HealthBar.crop(widthLife);
      this.game.global.healthBars[1] = p1HealthBar;
      this.player1.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);

      // Player 2
      this.player2 = new Player(2, characterSettings[1].x, characterSettings[1].y, characterSettings[1].skin);
      let p2HealthBar = this.game.add.sprite(characterSettings[1].x - 50, characterSettings[1].y - 100, bmd);
      p2HealthBar.cropEnabled = true;
      p2HealthBar.crop(widthLife);
      this.game.global.healthBars[2] = p2HealthBar;
      this.player2.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);

      //Player 3
      this.player3 = new Player(3, 75, 313, 'lucifer');
      let p3HealthBar = this.game.add.sprite(characterSettings[2].x - 50, characterSettings[2].y - 100, bmd);
      p3HealthBar.cropEnabled = true;
      p3HealthBar.crop(widthLife);
      this.game.global.healthBars[3] = p3HealthBar;
      this.player3.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);

      //Player 4
      this.player4 = new Player(4, this.world.width - 90, 313, 'kickapoo');
      let p4HealthBar = this.game.add.sprite(characterSettings[3].x - 50, characterSettings[3].y - 100, bmd);
      p4HealthBar.cropEnabled = true;
      p4HealthBar.crop(widthLife);
      this.game.global.healthBars[4] = p4HealthBar;
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
      let index = 0;

      for (let [deviceId, value] of window.game.global.playerManager.getPlayers()) {
        let character = new Player(deviceId, characterSettings[index].x, characterSettings[index].y, characterSettings[index].skin);
        let base = new Base(map.tsize,characterSettings[index].baseX, characterSettings[index].baseY, characterSettings[index].skin + '_base', character);
        let healthBar = this.game.add.sprite(characterSettings[index].baseX - 50, characterSettings[index].baseY - 100, bmd);
        healthBar.cropEnabled = true;
        healthBar.crop(widthLife);
        this.game.global.healthBars[deviceId] = healthBar;
        character.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);
        window.game.global.playerManager.setCharacter(deviceId, character);
        index += 1;
      }
    }
    this.createMap(map);

  }

  update() {
    //particle visibility (fading in and out)
    this.glowingParticles.updateVisibility();
    if(window.game.global.dev) {
      this.updatePlayer();
      this.updatePlayer2();
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
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.A)) {
      this.player1.moveToLeft();
      this.player1.movingTo = 'left';
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
      this.player1.moveToRight();
      this.player1.movingTo = 'right';
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
    	this.player1.jump();
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
    	this.player1.shoot();
    }
    else {
      this.player1.idle();
      this.player1.movingTo = null;
    }
  }

  updatePlayer2() {
    this.player2.move();
    if (this.cursors.left.isDown) {
      this.player2.moveToLeft();
      this.player2.movingTo = 'left';
    }
    else if (this.cursors.right.isDown)
    {
      this.player2.moveToRight();
      this.player2.movingTo = 'right';
    }
    else if (this.cursors.up.isDown)
    {
    	this.player2.jump();
    }
    else if (this.cursors.down.isDown)
    {
    	this.player2.shoot();
    }
    else {
      this.player2.idle();
      this.player2.movingTo = null;
    }
  }

  createMap(map) {
    for (let c = 0; c < map.cols; c++) {
      for (let r = 0; r < map.rows; r++) {
        let tile = map.getTile(c, r);

        if (tile !== 0) { // 0 => empty tile
          let collisionTile = this.game.add.sprite(c * map.tsize + .5 * map.tsize, r * map.tsize + .5 * map.tsize, 'tiles', tile -1);
          collisionTile.width = map.tsize;
          collisionTile.height = map.tsize;
          this.game.physics.p2.enable(collisionTile); // enable(collisionTile, true);  too see box
          collisionTile.body.static = true;


          collisionTile.body.clearShapes();
          switch (tile) {
            case 1: //Rampe Rauf
              collisionTile.body.addPolygon({}, 0, 33, 15, 20, 35, 0);
              break;
            case 2: //Block mit Boden
              collisionTile.body.addPolygon({}, 0, 31  ,  0, 4  ,  33, 4  ,  33, 31   );
              break;
            case 3: //Rampe Runter
              collisionTile.body.addPolygon({},  0, 0, 12, 23, 34, 32 );
              break;
            case 4: //Linke Kante
              collisionTile.body.addPolygon({}, 28, 4  ,  28, 33  ,  10, 33  ,  2, 4  );
              break;
            case 5: //Linker Ansatz an Kante
              collisionTile.body.addPolygon({}, 0, 32  ,  0, 3  ,  33, 3 ,  33, 32 );
              break;
            case 6: //Rechter Ansatz an Kante
              collisionTile.body.addPolygon({},    0, 32  ,  0, 3  ,  33, 3 ,  33, 32  );
              break;
            case 7: //Rechte Kante
              collisionTile.body.addPolygon({}, 22, 33  ,  4, 33  ,  4, 4  ,  31, 4  );
              break;
            case 8: //Wand nach Rechts schauend
              collisionTile.body.addPolygon({}, 0, 33  ,  0, 0  ,  20, 0  ,  20, 33   );
              break;
            case 9: //Wand nach Links schauend
              collisionTile.body.addPolygon({},  0, 33  ,  0, 0  ,  20, 0  ,  20, 33  );
              break;
            case 10: //Block
              collisionTile.body.addPolygon({}, 0, 33  ,  0, 2  ,  33, 2  ,  33, 33   );
              break;
            case 11: //Rampen Boden rauf
              collisionTile.body.addPolygon({}, 1, 33, 15, 15, 32, 2);
              break;
            case 12: //Rampen Boden runter
              collisionTile.body.addPolygon({}, 12, 0, 18, 10, 40, 42 );
              break;
            default:
              collisionTile.body.addPolygon({} , 0, 33, 0, 0, 33, 0, 33, 33 );
          }
          collisionTile.body.setCollisionGroup(this.tilesCollisionGroup);
          collisionTile.body.collides([this.playerCollisionGroup, this.bulletCollisionGroup]);
        }
      }
    }
  }

  shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  createItems() {
    this.powerItem = new Item();
  }

  render() {
    this.game.debug.text('FPS: ' + this.game.time.fps || '--', 20, 20);
  }
}
