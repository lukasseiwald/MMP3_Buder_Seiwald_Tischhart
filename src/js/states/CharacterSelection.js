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

		window.game.global.winner = null;
	}
	create () {
		this.timer = 0;
		this.characterSelectedCounter = 0;
		this.characters = new Map();
		const that = this;
		const takenSkins = [];
		const positionMapping = [];

		// IMAGES

		this.bg1 = addImage(this, 0, 0, 'background1', this.world.width, this.world.height);

		// PARTICLES

		this.bg2 = addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

		this.glowingParticles = new Particle('spark', 30, 5000, 100);
		this.glowingParticles.startEmitter();

		this.steamParticles = new Particle('smoke', 150, 8000, 1);
		this.steamParticles.startEmitter();

		this.lavaParticles = new Particle('lava', 0, 4000, 1);
		this.lavaParticles.startEmitter();

		// FRAME AROUND

		this.bg4 = addImage(this, 0, 0, 'backgroundCharacterSelection', this.world.width, this.world.height);

		// TEXT ELEMENTS
		this.headline = this.add.text(this.world.centerX, this.world.height * 0.3, 'Select Your Fighter', headlineStyling);
		this.headline.anchor.setTo(0.5, 0.5);

		const playerSettings = [
			window.game.world.centerX - this.unit * 14,
			window.game.world.centerX - this.unit * 7,
			window.game.world.centerX + this.unit * 7,
			window.game.world.centerX + this.unit * 14
		];

		const silhouetteSkins = ['egyptian', 'kickapoo', 'knight', 'kickapoo'];

		function createSilhouettes() {
			let index = 0;

			for (const [deviceId, value] of window.game.global.playerManager.getPlayers()) {
				window.game.global.playerManager.setSkin(deviceId, undefined);
				window.game.global.playerManager.setScore(deviceId, 0);

				const plateau = addImage(that, playerSettings[index], window.game.world.height * 0.42, 'characterPlateau', 192, 64);
				const silhouette = that.add.sprite(playerSettings[index], window.game.world.height * 0.42, silhouetteSkins[index]);

				silhouette.animations.add('idle', ['Idle_000', 'Idle_001', 'Idle_002', 'Idle_003', 'Idle_004', 'Idle_005', 'Idle_006', 'Idle_007', 'Idle_008', 'Idle_009', 'Idle_010', 'Idle_011', 'Idle_012', 'Idle_013', 'Idle_014', 'Idle_015', 'Idle_016', 'Idle_017'], 18, true);
				silhouette.animations.play('idle');

				silhouette.tint = 0x000000;

				if (index < 2) {
					silhouette.scale.x = that.scale * 2;
				}
				else {
					silhouette.scale.x = -that.scale * 2;
				}
				silhouette.scale.y = that.scale * 2;

				plateau.x = silhouette.x + silhouette.width * 0.5;
				plateau.y = silhouette.bottom - 40;
				plateau.anchor.setTo(0.5, 0.5);
				const nickname = that.add.text(plateau.x, plateau.bottom + that.unit, value.nickname, subheadlineStyling);

				nickname.anchor.setTo(0.5, 0.5);

				positionMapping[deviceId] = {
					posX: playerSettings[index],
					name: nickname
				};

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
					window.game.global.playerManager.broadcast({
						screen: 'characterSelection',
						action: 'selected_character',
						selectedCharacter: data.selectedCharacter
					});
					takenSkins.push(data.selectedCharacter);
					break;
				case 'character_deselected':
					const selectedCharacter = data.selectedCharacter;

					window.game.global.playerManager.setSkin(deviceId, undefined);
					getPlayers('deselect', deviceId, data.selectedCharacter);
					window.game.global.playerManager.broadcast({
						screen: 'characterSelection',
						action: 'deselected_character',
						selectedCharacter: selectedCharacter
					});
					takenSkins.splice(takenSkins.indexOf(selectedCharacter, 1));
					break;
				case '':
					break;
				default:
				}
			}
		};

		function getPlayers(mode, deviceId, skin) {
			window.game.global.playerManager.getPlayerCharacter(deviceId).destroy();

			const character = window.game.add.sprite(positionMapping[deviceId].posX, window.game.world.height * 0.42, skin);

			character.animations.add('idle', ['Idle_000', 'Idle_001', 'Idle_002', 'Idle_003', 'Idle_004', 'Idle_005', 'Idle_006', 'Idle_007', 'Idle_008', 'Idle_009', 'Idle_010', 'Idle_011', 'Idle_012', 'Idle_013', 'Idle_014', 'Idle_015', 'Idle_016', 'Idle_017'], 18, true);
			character.animations.add('slash', ['Slashing_000', 'Slashing_001', 'Slashing_002', 'Slashing_003', 'Slashing_004', 'Slashing_005', 'Slashing_006', 'Slashing_007', 'Slashing_008', 'Slashing_009', 'Slashing_010', 'Slashing_011'], 15, false);
			character.animations.add('dying', ['Dying_000', 'Dying_001', 'Dying_002', 'Dying_003', 'Dying_004', 'Dying_005', 'Dying_006', 'Dying_007', 'Dying_008', 'Dying_009', 'Dying_010', 'Dying_011', 'Dying_012', 'Dying_013', 'Dying_014'], 17, false);

			if (positionMapping[deviceId].posX < window.game.world.width * 0.5) {
				character.scale.setTo(that.scale * 2, that.scale * 2);
			}
			else {
				character.scale.setTo(-(that.scale * 2), that.scale * 2);
			}

			if(mode === 'select') {
				window.game.global.throwAudio[0].play();
				character.animations.play('slash');
				character.animations.currentAnim.onComplete.add(function() {
					character.animations.play('idle');
				}, this);

				that.characterSelectedCounter += 1;
			}
			else if(mode === 'deselect') {
				character.tint = 0x000000;
				character.animations.play('dying');
				character.animations.currentAnim.onComplete.add(function() {
					setTimeout(() => {
						character.animations.play('idle');
					}, 3000);
				}, this);
				that.characterSelectedCounter -= 1;
			}

			window.game.global.playerManager.setCharacter(deviceId, character);

			if(that.characterSelectedCounter > 3) {
				window.game.global.airConsole.broadcast({
					screen: 'characterSelection',
					action: 'all_characters_selected'
				});
				countToFight();
			}
		}

		function countToFight() {
			that.headline.setText('GET READY TO FIGHT!');

			// Style of Fight Counter
			const style = { font: '45px Bungee', fill: '#111111', align: 'center' };
			let counter = 3;
			const text = window.game.add.text(that.world.width / 2 - 20, that.world.height / 14, '', style);

			const startGameTimer = setInterval(() => {
				if(counter === 3) {
					window.game.global.countdownAudio.play();
				}
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
		const disconnectedPlayers = [];

		window.game.global.airConsole.onDisconnect = function(deviceId) {
			disconnectedPlayers.push(deviceId);
			positionMapping[deviceId].name.text = 'disconnected';
			positionMapping[deviceId].name.addColor('#d51c1c', 0);
			const skin = window.game.global.playerManager.getSkin(deviceId);

			if(skin) {
				getPlayers('deselect', deviceId, skin);
				window.game.global.playerManager.setSkin(deviceId, undefined);
				window.game.global.playerManager.broadcast({
					screen: 'characterSelection',
					action: 'deselected_character',
					selectedCharacter: skin
				});
			}
		};

		window.game.global.airConsole.onConnect = function(deviceId) {
			window.game.global.playerManager.sendMessageToPlayer(deviceId, {
				screen: 'characterSelection',
				action: 'reconnected',
				skins: takenSkins
			});
			const length = disconnectedPlayers.length;

			if(length > 0) {
				const oldDeviceId = disconnectedPlayers[length - 1];

				if (oldDeviceId !== deviceId) {
					window.game.global.playerManager.setNewDeviceID(oldDeviceId, deviceId);
					const mappingDevice = positionMapping[oldDeviceId];

					positionMapping[oldDeviceId] = null;
					positionMapping[deviceId] = mappingDevice;
				}
				positionMapping[deviceId].name.text = window.game.global.playerManager.getNickname(deviceId);
				positionMapping[deviceId].name.addColor('#000000', 0);

				disconnectedPlayers.pop();
			}
		};
		createSilhouettes();
	}
	update() {
		this.glowingParticles.updateVisibility();
	}
}
