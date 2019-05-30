import { addImage } from '../utils';
import Base from '../sprites/Base';
import Item from '../sprites/Item';
import Particle from '../Particle';
import Phaser from 'phaser';
import Player from '../sprites/Player';

export default class extends Phaser.State {
	init() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		const gameWidth = this.world.width;
		const gameHeight = this.world.height;
		const ratio = this.width / this.height;

		// 1.8064 is the ratio with that the map was created
		if(ratio > 1.8064) {
			this.scale.setGameSize(this.height * 1.8064, this.height);
			window.game.global.scale = this.world.height / gameHeight;
		}
		else {
			this.scale.setGameSize(this.width, this.width / 1.8064);
			window.game.global.scale = this.world.width / gameWidth;
		}

		// Audio
		window.game.global.lavaAudio.stop();
		window.game.global.bgMusic.play();
		// window.game.time.events.add(Phaser.Timer.SECOND * 3, this.playTutorial, this);
	}

	preload() {
		// For indicating FPS
		this.game.time.advancedTiming = true;
	}

	create() {
		const map = {
			cols: 56,
			rows: 31,
			tsize: 33,
			tiles: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 6, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 5, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 6, 2, 7, 0, 0, 0, 0, 0, 0, 4, 2, 5, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 7, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 0, 4, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 4, 2, 2, 2, 5, 10, 10, 10, 10, 6, 2, 2, 2, 7, 0, 0, 0, 0, 4, 2, 7, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 0, 0, 0, 0, 0, 0, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 10],
			getTile(col, row) {
				return this.tiles[row * map.cols + col];
			}
		};

		map.tsize = window.game.world.width / map.cols;
		window.game.global.unit = map.tsize;

		const unit = window.game.global.unit;

		this.game.camera.roundPixels = true;

		map.itemPositions = [
			{x: 10.5 * unit, y: 16 * unit},
			{x: 13.5 * unit, y: 7 * unit},
			{x: 3 * unit, y: 4 * unit},
			{x: 18 * unit, y: 13 * unit},
			{x: 19 * unit, y: 28 * unit},
			{x: window.game.world.width - 10.5 * unit, y: 16 * unit},
			{x: window.game.world.width - 13.5 * unit, y: 7 * unit},
			{x: window.game.world.width - 3 * unit, y: 4 * unit},
			{x: window.game.world.width - 18 * unit, y: 13 * unit},
			{x: window.game.world.width - 19 * unit, y: 28 * unit},
			{x: window.game.world.width / 2, y: 3 * unit},
			{x: window.game.world.width / 2, y: 9 * unit},
			{x: window.game.world.width / 2, y: 21 * unit}
		];

		const characterSettings = [
			{
				skin: 'lucifer',
				x: unit * 5,
				y: unit * 26,
				baseX: 3 * unit,
				baseY: this.world.height - 3.5 * unit,
				healthbarX: 0.5 * unit,
				healthbarY: this.world.height - 6.5 * unit
			},
			{
				skin: 'inca',
				x: this.world.width - 90,
				y: unit * 26,
				baseX: this.world.width - 3 * unit,
				baseY: this.world.height - 3.5 * unit,
				// -healthbar.width - .5 (half tile on edge)
				healthbarX: this.world.width - unit * 6.5,
				healthbarY: this.world.height - 6.5 * unit
			},
			{
				skin: 'knight',
				x: 3 * unit,
				y: 10 * unit,
				baseX: 3 * unit,
				baseY: 9.5 * unit,
				healthbarX: 0.5 * unit,
				healthbarY: 6.6 * unit
			},
			{
				skin: 'egyptian',
				x: this.world.width - 90,
				y: unit * 10,
				baseX: this.world.width - 3 * unit,
				baseY: unit * 9.5,
				healthbarX: this.world.width - unit * 6.5,
				healthbarY: 6.5 * unit
			}
		];

		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.setBoundsToWorld(false, false, false, false);
		this.game.physics.p2.gravity.y = 4000;

		//  little bouncey
		this.game.physics.p2.defaultRestitution = 0.2;

		//  Turn on impact events for the world, without this we get no collision callbacks
		this.game.physics.p2.setImpactEvents(true);

		// Create our collision groups.
		// Mask: 4
		this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
		// Mask: 8
		this.tilesCollisionGroup = this.game.physics.p2.createCollisionGroup();
		// Mask: 16
		this.bulletCollisionGroup = this.game.physics.p2.createCollisionGroup();
		// Mask: 32
		this.soulCollisionGroup = this.game.physics.p2.createCollisionGroup();
		// Mask: 64
		this.baseCollisionGroup = this.game.physics.p2.createCollisionGroup();
		// Mask: 128
		this.itemCollisionGroup = this.game.physics.p2.createCollisionGroup();

		this.game.physics.p2.updateBoundsCollisionGroup();
		// this.game.physics.setBoundsToWorld();

		// IMAGES
		this.bg3 = addImage(this, 0, 0, 'background3', this.world.width, this.world.height);

		// PARTICLES

		this.bg2 = addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

		this.glowingParticles = new Particle('spark', 30, 5000, 100);
		this.glowingParticles.startEmitter();

		this.steamParticles = new Particle('smoke', 150, 8000, 100);
		this.steamParticles.startEmitter();

		this.lavaParticles = new Particle('lava', 0, 4000, 1);
		this.lavaParticles.startEmitter();

		// Tiles
		this.tiles = this.game.add.group();
		this.game.physics.p2.enable(this.tiles);
		this.tiles.physicsBodyType = Phaser.Physics.P2JS;

		// create Items ever x seconds
		this.game.global.itemPositions = this.shuffle(map.itemPositions);
		this.game.time.events.repeat(Phaser.Timer.SECOND * 17, 100, this.createItems, this);

		// HealthBar
		const bmd = this.game.add.bitmapData(unit * 6, unit * 0.5);

		bmd.ctx.beginPath();
		bmd.ctx.rect(0, 0, unit * 6, unit * 0.5);
		bmd.ctx.fillStyle = '#c92e08';
		bmd.ctx.fill();

		const widthLife = new Phaser.Rectangle(0, 0, bmd.width, bmd.height);

		if(window.game.global.dev) {
			const playersDev = new Array();

			for (let index = 0; index < 4; index += 1) {
				const character = new Player(index, characterSettings[index].x, characterSettings[index].y, characterSettings[index].skin);
				const base = new Base(unit, characterSettings[index].baseX, characterSettings[index].baseY, characterSettings[index].skin + '_base', character);

				character.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);
				playersDev[index] = character;
			}

			this.createMap(map);

			for (let index = 0; index < 4; index += 1) {
				const healthBar = this.game.add.sprite(characterSettings[index].healthbarX, characterSettings[index].healthbarY, bmd);

				healthBar.cropEnabled = true;
				healthBar.crop(widthLife);
				this.game.global.healthBars[index] = healthBar;
			}

			this.player1 = playersDev[0];
			this.player2 = playersDev[1];

			this.cursors = this.game.input.keyboard.createCursorKeys();

			this.wasd = {
				up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
				down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
				left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
				right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
			};
		}
		else {
			let index = 0;

			for (const [deviceId, value] of window.game.global.playerManager.getPlayers()) {
				const character = new Player(deviceId, characterSettings[index].x, characterSettings[index].y, value.skin);
				const base = new Base(unit, characterSettings[index].baseX, characterSettings[index].baseY, value.skin + '_base', character);

				character.spawnPlayer(this.playerCollisionGroup, this.tilesCollisionGroup, this.bulletCollisionGroup, this.soulCollisionGroup, this.baseCollisionGroup);
				window.game.global.playerManager.setCharacter(deviceId, character);
				index += 1;
			}

			this.createMap(map);
			index = 0;
			for (const [deviceId, value] of window.game.global.playerManager.getPlayers()) {
				const healthBar = window.game.add.sprite(characterSettings[index].healthbarX, characterSettings[index].healthbarY, bmd);

				healthBar.cropEnabled = true;
				healthBar.crop(widthLife);
				window.game.global.healthBars[deviceId] = healthBar;
				index += 1;
			}
		}
		const disconnectedPlayers = [];

		window.game.global.airConsole.onDisconnect = function(deviceId) {
			disconnectedPlayers.push(deviceId);
		};
		window.game.global.airConsole.onConnect = function(deviceId) {
			const length = disconnectedPlayers.length;

			if(length > 0) {
				const oldDeviceId = disconnectedPlayers[length - 1];

				if (oldDeviceId !== deviceId) {
					window.game.global.playerManager.setNewDeviceID(oldDeviceId, deviceId);
				}
				disconnectedPlayers.pop();
				window.game.global.playerManager.sendMessageToPlayer(deviceId, {
					screen: 'game',
					action: 'reconnected'
				});
			}
		};
	}

	update() {
		// particle visibility (fading in and out)
		this.glowingParticles.updateVisibility();
		if(window.game.global.dev) {
			this.updatePlayer();
			this.updatePlayer2();
		}
		else {
			for (const [deviceId, value] of window.game.global.playerManager.getPlayers()) {
				const character = window.game.global.playerManager.getPlayerCharacter(deviceId);

				character.move();
			}

			window.game.global.airConsole.onMessage = function(deviceId, data) {
				const character = window.game.global.playerManager.getPlayerCharacter(deviceId);

				if(character !== null) {
					switch(data.action) {
					case 'right':
						character.movingTo = 'right';
						break;
					case 'left':
						character.movingTo = 'left';
						break;
					case 'jump':
						character.jump();
						// character.movingTo = 'jump';
						break;
					case 'shoot':
						character.shoot(data.shootTime);
						break;
					case 'dashRight':
						character.movingTo = 'dashRight';
						break;
					case 'dashLeft':
						character.movingTo = 'dashLeft';
						break;
					default:
						character.movingTo = null;
						character.idle();
					}
				}
				else {
					// console.info('player is null');
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
		else if (this.game.input.keyboard.isDown(Phaser.Keyboard.D)) {
			this.player1.moveToRight();
			this.player1.movingTo = 'right';
		}
		else if (this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			this.player1.jump();
		}
		else if (this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			this.player1.shoot(500);
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
		else if (this.cursors.right.isDown) {
			this.player2.moveToRight();
			this.player2.movingTo = 'right';
		}
		else if (this.cursors.up.isDown) {
			this.player2.jump();
		}
		else if (this.cursors.down.isDown) {
			this.player2.shoot(400);
		}
		else {
			this.player2.idle();
			this.player2.movingTo = null;
		}
	}

	createMap(map) {
		const unit = window.game.global.unit;
		const scale = window.game.global.scale;

		for (let c = 0; c < map.cols; c += 1) {
			for (let r = 0; r < map.rows; r += 1) {
				const tile = map.getTile(c, r);

				// 0 equals an empty tile
				if(tile !== 0) {
					const collisionTile = this.game.add.sprite(c * unit, r * unit, 'tiles', tile - 1);

					collisionTile.scale.setTo(scale, scale);
					// enable bounding boxes
					this.game.physics.p2.enable(collisionTile);
					collisionTile.body.static = true;

					collisionTile.body.clearShapes();
					switch (tile) {
					// Rampe Rauf
					case 1:
						collisionTile.body.addPolygon({}, 0, 33 * scale, 33 * scale, 0, 17, 23);
						break;
					// Rampe Runter
					case 3:
						collisionTile.body.addPolygon({}, 0, 0, 12 * scale, 23 * scale, 34 * scale, 32 * scale);
						break;
					// Linke Kante
					case 4:
						collisionTile.body.addPolygon({}, 0, 33 * scale, 0, 0, 33 * scale, 0, 33 * scale, 33 * scale);
						break;
					// Rechte Kante
					case 7:
						collisionTile.body.addPolygon({}, 0, 33 * scale, 0, 0, 33 * scale, 0, 33 * scale, 33 * scale);
						break;
					// Rampen Boden rauf
					case 11:
						collisionTile.body.addPolygon({}, 1 * scale, 33 * scale, 15 * scale, 15 * scale, 32 * scale, 2 * scale);
						break;
					// Rampen Boden runter
					case 12:
						collisionTile.body.addPolygon({}, 12 * scale, 0, 18 * scale, 10 * scale, 40 * scale, 33 * scale);
						break;
					default:
						collisionTile.body.addPolygon({}, 0, 33 * scale, 0, 0, 33 * scale, 0, 33 * scale, 33 * scale);
					}
					collisionTile.body.setCollisionGroup(this.tilesCollisionGroup);
					collisionTile.body.collides([this.playerCollisionGroup, this.bulletCollisionGroup]);
				}
			}
		}
	}

	shuffle(a) {
		for (let i = a.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));

			[a[i], a[j]] = [a[j], a[i]];
		}
		return a;
	}

	createItems() {
		this.powerItem = new Item();
	}

	playTutorial() {
		window.game.global.tutorialAudio.play();
	}

	render() {
		this.game.debug.text('FPS: ' + this.game.time.fps || '--', 20, 20);
	}
}
