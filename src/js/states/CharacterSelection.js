import { headlineStyling, subheadlineStyling } from '../stylings';
import {addImage} from '../utils';
import Particle from '../Particle';
import Phaser from 'phaser';

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
		this.scale = window.game.global.scale;
		this.unit = 33;
		window.game.global.unit = this.unit;
	}
	create () {
		this.timer = 0;
		this.characterSelectedCounter = 0;
		this.characters = new Map();
		const that = this;

		// IMAGES
		this.bg1 = addImage(this, 0, 0, 'background1', this.world.width, this.world.height);

		// Particles
		this.glowingParticles = new Particle('spark', 30, 5000, 100);
		this.glowingParticles.startEmitter();

		this.steamParticles = new Particle('smoke', 150, 8000, 100);
		this.steamParticles.startEmitter();

		this.bg3 = addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

		this.lavaParticles = new Particle('lava', 0, 4000, 1);
		this.lavaParticles.startEmitter();

		// Background Frame
		this.bg4 = addImage(this, 0, 0, 'backgroundCharacterSelection', this.world.width, this.world.height);

		// TEXT ELEMENTS
		this.headline = this.add.text(this.world.centerX, this.world.height * 0.3, 'Select Your Fighter', headlineStyling);
		this.headline.anchor.setTo(0.5, 0.5);

		this.player = {
			id: null,
			name: '',
			character: ''
		};

		const playerSettings = [
			window.game.world.centerX - this.unit * 14,
			window.game.world.centerX - this.unit * 7,
			window.game.world.centerX + this.unit * 7,
			window.game.world.centerX + this.unit * 14
		];

		const positionMapping = [];

		function createSilhouettes() {
			let index = 0;

			for (const [deviceId, value] of window.game.global.playerManager.getPlayers()) {
				const plateau = addImage(that, playerSettings[index] + 20, window.game.world.height * 0.64, 'characterPlateau', 192, 64);
				const silhouette = that.add.sprite(playerSettings[index] + 15, window.game.world.height * 0.46, 'characterSilhouette');

				if (index < 2) {
					silhouette.scale.x = that.scale * 1.3;
				}
				else {
					silhouette.scale.x = -that.scale * 1.3;
				}
				silhouette.scale.y = that.scale * 1.3;

				plateau.x = silhouette.x + silhouette.width / 2.3;
				plateau.y = window.game.world.height * 0.45 + silhouette.height;
				plateau.anchor.setTo(0.5, 0.5);

				const nickname = that.add.text(plateau.x, plateau.bottom + that.unit * 2, value.nickname, subheadlineStyling);

				nickname.anchor.setTo(0.5, 0.5);

				positionMapping[deviceId] = playerSettings[index];

				window.game.global.playerManager.setCharacter(deviceId, silhouette);
				index += 1;
			}
		}

		window.game.global.airConsole.onMessage = function(deviceId, data) {
			const character = window.game.global.playerManager.getPlayerCharacter(deviceId);

			if(character !== null) {
				switch(data.action) {
				case 'character_selected':
					window.game.global.playerManager.setSkin(deviceId, data.selectedCharacter);
					getPlayers('select', deviceId, data.selectedCharacter);
					window.game.global.airConsole.broadcast({
						screen: 'characterSelection',
						action: 'selected_character',
						selectedCharacter: data.selectedCharacter,
						selectedCharacterIndex: data.selectedCharacterIndex
					});
					break;
				case 'character_deselected':
					let selectedCharacter = data.selectedCharacter;
					let selectedCharacterIndex = data.selectedCharacterIndex;
					window.game.global.playerManager.setSkin(deviceId, undefined);
					getPlayers('deselect', deviceId, data.selectedCharacter);
					window.game.global.airConsole.broadcast({
						screen: 'characterSelection',
						action: 'deselected_character',
						selectedCharacter: selectedCharacter,
						selectedCharacterIndex: selectedCharacterIndex
					});
					break;
				case '':
					break;
				default:
				}
			}
		};

		function getPlayers(mode, deviceId, skin) {
			const index = that.characterSelectedCounter;

			window.game.global.playerManager.getPlayerCharacter(deviceId).destroy();
			console.log(window.game.global.playerManager.getPlayerCharacter(deviceId));

			if(mode === 'select') {
				const character = window.game.add.sprite(positionMapping[deviceId] - that.unit, window.game.world.height * 0.42, skin);
				character.animations.add('idle', ['Idle_000', 'Idle_001', 'Idle_002', 'Idle_003', 'Idle_004', 'Idle_005', 'Idle_006', 'Idle_007', 'Idle_008', 'Idle_009', 'Idle_010', 'Idle_011', 'Idle_012', 'Idle_013', 'Idle_014', 'Idle_015', 'Idle_016', 'Idle_017'], 18, true);
				character.animations.add('throw', ['Throwing_000', 'Throwing_001', 'Throwing_002', 'Throwing_003', 'Throwing_004', 'Throwing_005', 'Throwing_006', 'Throwing_007', 'Throwing_008', 'Throwing_009', 'Throwing_010', 'Throwing_011'], 20, false);
				character.animations.add('slash', ['Slashing_000', 'Slashing_001', 'Slashing_002', 'Slashing_003', 'Slashing_004', 'Slashing_005', 'Slashing_006', 'Slashing_007', 'Slashing_008', 'Slashing_009', 'Slashing_010', 'Slashing_011'], 15, false);
				character.animations.add('dying', ['Dying_000', 'Dying_001', 'Dying_002', 'Dying_003', 'Dying_004', 'Dying_005', 'Dying_006', 'Dying_007', 'Dying_008', 'Dying_009', 'Dying_010', 'Dying_011', 'Dying_012', 'Dying_013', 'Dying_014'], 17, false);
				character.animations.add('kicking', ['Kicking_000', 'Kicking_001', 'Kicking_002', 'Kicking_003', 'Kicking_004', 'Kicking_005', 'Kicking_006', 'Kicking_007', 'Kicking_008', 'Kicking_009', 'Kicking_010', 'Kicking_011'], 17, false);
				character.animations.play('idle');

				if (positionMapping[deviceId] < window.game.world.width * 0.5) {
					character.scale.setTo(that.scale * 2, that.scale * 2);
				}
				else {
					character.scale.setTo(-(that.scale * 2), that.scale * 2);
					character.x = character.x + that.unit * 3;
				}

				window.game.global.playerManager.setCharacter(deviceId, character);
				that.characterSelectedCounter += 1;
			}
			else if('deselect') {
				const silhouette = window.game.add.sprite(positionMapping[deviceId] + 15, window.game.world.height * 0.46, 'characterSilhouette');

				if (positionMapping[deviceId] < window.game.world.width * 0.5) {
					silhouette.scale.x = that.scale * 1.3;
				}
				else {
					silhouette.scale.x = -that.scale * 1.3;
				}
				silhouette.scale.y = that.scale * 1.3;

				window.game.global.playerManager.setCharacter(deviceId, silhouette);
				that.characterSelectedCounter -= 1;
			}

			if(that.characterSelectedCounter > 3) {
				countToFight();
			}
		}

		function countToFight() {
			that.headline.setText('GET READY TO FIGHT!');

			// Style of Fight Counter
			const style = { font: '45px Bungee', fill: '#111111', align: 'center' };
			let counter = 5;
			const text = window.game.add.text(that.world.width / 2 - 20, that.world.height / 14, '', style);
			const startGameTimer = setInterval(() => {
				text.setText(counter);
				if(counter < 1) {
					clearInterval(startGameTimer);
					window.game.global.airConsole.broadcast({
						screen: 'characterSelection',
						action: 'change_to_controller'
					});
					that.state.start('Level1');
				}
				counter = counter - 1;
			}, 1000);
		}
		// wenn mehrere disconnecten noch ansehen -> array machen und dann wenn device id gleich is zuweisen??
		let disconnectedPlayers = [];

		window.game.global.airConsole.onDisconnect = function(deviceId) {
			console.log(deviceId + 'disconnected');
			disconnectedPlayers.push(deviceId);
		}

		window.game.global.airConsole.onConnect = function(deviceId) {
			console.log(deviceId + 'connected');
			// TODO: update nickname on screen
			// on controller muss selected characters ausgegraut werden -> oder wenn schon character gepickt war
			// keinen mehr auswählen können
			window.game.global.playerManager.sendMessageToPlayer(deviceId, {
				screen: 'characterSelection',
				action: 'reconnected'
			});
			const length = disconnectedPlayers.length;

			if(length > 0) {
				window.game.global.playerManager.setNewDeviceID(disconnectedPlayers[length - 1], deviceId);
				disconnectedPlayers.pop()
			}
		}
		createSilhouettes();
	}
}
