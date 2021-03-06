import { headlineStyling, subheadlineStyling } from '../stylings';
import { addImage } from '../utils';
import Particle from '../Particle';
import Phaser from 'phaser';

export default class extends Phaser.State {
	init() {
		this.scale = window.game.global.scale;
		this.unit = window.game.global.unit;
		this.fireworksAudio = window.game.add.audio('fireworks', 1, false);

		window.game.global.lavaAudio.play();
	}
	create() {
		this.timer = 0;
		this.winner = null;
		const that = this;

		// IMAGES
		this.bg1 = addImage(this, 0, 0, 'background1', this.world.width, this.world.height);

		this.glowingParticles = new Particle('spark', 30, 5000, 100);
		this.glowingParticles.startEmitter();

		this.steamParticles = new Particle('smoke', 150, 8000, 100);
		this.steamParticles.startEmitter();

		// Lava Bg
		// this.bg3 = addImage(this, 0, 0, 'background2', this.world.width, this.world.height);

		this.lavaParticles = new Particle('lava', 0, 4000, 1);
		this.lavaParticles.startEmitter();

		// Background Frame
		this.bg4 = addImage(this, 0, 0, 'backgroundCharacterSelection', this.world.width, this.world.height);

		// TEXT ELEMENTS
		this.headline = this.add.text(this.world.centerX, this.world.height * 0.3, '', headlineStyling);
		this.headline.anchor.setTo(0.5, 0.5);

		this.characters = new Map();

		const playerSettings = [
			{
				deviceId: null,
				character: null,
				x: window.game.world.centerX - this.unit * 20
			},
			{
				deviceId: null,
				character: null,
				x: window.game.world.centerX - this.unit * 10
			},
			{
				deviceId: null,
				character: null,
				x: window.game.world.centerX + this.unit * 10
			},
			{
				deviceId: null,
				character: null,
				x: window.game.world.centerX + this.unit * 20
			}
		];

		let test = [];

		function getPlayers() {
			let index = 0;
			const players = window.game.global.playerManager.getPlayers();

			that.winner = window.game.global.winner;

			for(const [key, value] of players) {
				// Add Plateau before so player wont get cover by it;
				const plateau = addImage(that, playerSettings[index].x, window.game.world.height * 0.35, 'characterPlateau', 192, 64);

				// Sprite
				const character = window.game.add.sprite(playerSettings[index].x, window.game.world.height * 0.45, value.skin);

				if(index < 2) {
					character.scale.setTo(that.scale * 2, that.scale * 2);
				}
				else {
					character.scale.setTo(-(that.scale * 2), that.scale * 2);
				}
				character.animations.add('idle', ['Idle_000', 'Idle_001', 'Idle_002', 'Idle_003', 'Idle_004', 'Idle_005', 'Idle_006', 'Idle_007', 'Idle_008', 'Idle_009', 'Idle_010', 'Idle_011', 'Idle_012', 'Idle_013', 'Idle_014', 'Idle_015', 'Idle_016', 'Idle_017'], 18, true);
				character.animations.add('throw', ['Throwing_000', 'Throwing_001', 'Throwing_002', 'Throwing_003', 'Throwing_004', 'Throwing_005', 'Throwing_006', 'Throwing_007', 'Throwing_008', 'Throwing_009', 'Throwing_010', 'Throwing_011'], 20, false);
				character.animations.add('slash', ['Slashing_000', 'Slashing_001', 'Slashing_002', 'Slashing_003', 'Slashing_004', 'Slashing_005', 'Slashing_006', 'Slashing_007', 'Slashing_008', 'Slashing_009', 'Slashing_010', 'Slashing_011'], 15, false);
				character.animations.add('dying', ['Dying_000', 'Dying_001', 'Dying_002', 'Dying_003', 'Dying_004', 'Dying_005', 'Dying_006', 'Dying_007', 'Dying_008', 'Dying_009', 'Dying_010', 'Dying_011', 'Dying_012', 'Dying_013', 'Dying_014'], 17, false);
				character.animations.add('kicking', ['Kicking_000', 'Kicking_001', 'Kicking_002', 'Kicking_003', 'Kicking_004', 'Kicking_005', 'Kicking_006', 'Kicking_007', 'Kicking_008', 'Kicking_009', 'Kicking_010', 'Kicking_011'], 17, false);
				character.animations.play('idle');

				plateau.x = character.x + character.width / 2;
				plateau.y = character.bottom - character.height / 6.1;
				const nickname = that.add.text(character.x + character.width / 2, character.bottom + character.height / 7, value.nickname, subheadlineStyling);

				test[value.deviceId] = nickname;

				const score = that.add.text(character.x + character.width / 2, character.bottom + character.height / 4, value.score, subheadlineStyling);

				plateau.anchor.setTo(0.5, 0.5);
				nickname.anchor.setTo(0.5, 0.5);
				score.anchor.setTo(0.5, 0.5);
				that.characters.set(value.deviceId, character);

				if(that.winner != null) {
					that.fireworksAudio.play();
					if(that.winner === value.deviceId) {
						character.animations.play('slash');
						character.animations.currentAnim.onComplete.add(function() {
							character.animations.play('idle');
						}, this);
						const crown = addImage(that, character.x + character.width / 2, character.top, 'crown', 40, 23);

						crown.anchor.setTo(0.5, 0.5);
						that.headline.setText(value.nickname + ' WON THE GAME');
					}
					else {
						character.animations.play('dying');
					}
					setNewGameButton();
				}
				index += 1;
			}
		}

		window.game.global.airConsole.onMessage = function (deviceId, data) {
			if(data.screen === 'emotes') {
				if (data.emote) {
					playEmote(data.emote, deviceId);
				}
				else if (data.ready) {
					countToFight();
				}
			}
		};

		function playEmote(emoteType, deviceId) {
			const player = that.characters.get(deviceId);

			switch(emoteType) {
			case 'emote1':
				player.animations.play('throw');
				player.animations.currentAnim.onComplete.add(function() {
					player.animations.play('idle');
				}, this);
				playSpeechEmote(player, 'meatEmote');
				break;
			case 'emote2':
				player.animations.play('dying');
				playSpeechEmote(player, 'frogEmote');
				break;
			case 'emote3':
				player.animations.play('kicking');
				player.animations.currentAnim.onComplete.add(function() {
					player.animations.play('idle');
				}, this);
				playSpeechEmote(player, 'curseEmote');
				break;
			case 'emote4':
				playSpeechEmote(player, 'fingerEmote');
				break;
			default:
				break;
			}
		}

		function playSpeechEmote(player, emoteType) {
			const curseEmote = window.game.add.sprite(player.x + player.width * 0.75, player.y - 40, emoteType);

			if(player.scale.x < 0) {
				curseEmote.x = player.x + player.width * 0.25;
			}
			curseEmote.scale.setTo(that.scale * 2, that.scale * 2);
			curseEmote.animations.add('emoteBegin');
			curseEmote.animations.play('emoteBegin', 10, false);
			window.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
				curseEmote.destroy();
			}, this);
		}

		function countToFight() {
			let counter = 3;

			if(that.winner) {
				window.game.global.airConsole.broadcast({
					screen: 'emotes',
					action: 'characterSelection'
				});
				that.state.start('CharacterSelection');
			}
			if(that.winner === null) {
				window.game.global.airConsole.broadcast({
					screen: 'emotes',
					action: 'remove_ready_button'
				});
				that.headline.setText('GET READY TO FIGHT!');
				const style = { font: '45px Bungee', fill: '#111111', align: 'center' };
				const text = window.game.add.text(that.world.width / 2, that.world.height * 0.11, '', style);

				text.anchor.setTo(0.5, 0.5);
				const startGameTimer = setInterval(() => {
					if(counter === 3) {
						window.game.global.countdownAudio.play();
					}
					text.setText(counter);
					if (counter < 1) {
						clearInterval(startGameTimer);
						window.game.global.airConsole.broadcast({
							screen: 'emotes',
							action: 'change_to_controller'
						});
						that.state.start('Level1');
					}
					counter = counter - 1;
				}, 1000);
			}
		}

		function setNewGameButton() {
			window.game.global.airConsole.broadcast({
				screen: 'emotes',
				action: 'new_game_button'
			});
		}

		getPlayers();

		const disconnectedPlayers = [];

		window.game.global.airConsole.onDisconnect = function(deviceId) {
			disconnectedPlayers.push(deviceId);
			const masterId = window.game.global.playerManager.getMaster();

			window.game.global.playerManager.sendMessageToPlayer(masterId, {
				screen: 'emotes',
				action: 'player_disconnected'
			});
			test[deviceId].text = 'disconnected';
			test[deviceId].addColor('#d51c1c', 0);
		};
		window.game.global.airConsole.onConnect = function(deviceId) {
			let length = disconnectedPlayers.length;

			if(length > 0) {
				const oldDeviceId = disconnectedPlayers[length - 1];

				if (oldDeviceId !== deviceId) {
					window.game.global.playerManager.setNewDeviceID(oldDeviceId, deviceId);
				}
				disconnectedPlayers.pop();
				window.game.global.playerManager.sendMessageToPlayer(deviceId, {
					screen: 'emotes',
					action: 'reconnected'
				});

				test[deviceId] = test[oldDeviceId];
			}

			test[deviceId].text = window.game.global.playerManager.getNickname(deviceId);
			test[deviceId].addColor('#000000', 0);

			length = disconnectedPlayers.length;
			const masterId = window.game.global.playerManager.getMaster();

			if (length === 0) {
				window.game.global.playerManager.sendMessageToPlayer(masterId, {
					screen: 'emotes',
					action: 'all_players_connected'
				});
			}
		};
	}
}
