import {headlineStyling, subheadlineStyling} from '../stylings';
import {addImage} from '../utils';
import Particle from '../Particle';
import Phaser from 'phaser';
import PlayerManager from '../PlayerManager';

export default class extends Phaser.State {
	init () {
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.scale.setGameSize(this.width, this.height);
	}

	create () {

		window.game.global.playerManager = new PlayerManager();
		window.game.global.playerManager.setConnectedPlayers();

		this.timer = 0;
		const that = this;

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

		// TEXT ELEMENTS

		this.headline = this.add.text(this.world.centerX, this.world.height * 0.3, 'Waiting for players to join the game!', headlineStyling);
		this.headline.anchor.setTo(0.5, 0.5);

		const playerNames = this.add.text(this.world.centerX, this.world.height * 0.5, '', subheadlineStyling);

		playerNames.anchor.setTo(0.5, 0.5);

		this.touchToContinue = this.add.text(this.world.centerX, this.world.centerY + 200, '', subheadlineStyling);
		this.touchToContinue.anchor.setTo(0.5, 0.5);

		const touchToContinue = this.touchToContinue;
		const numberOfPlayers = this.add.text(this.world.centerX, this.world.height * 0.35, window.game.global.playerManager.getConnectedPlayerNum() + '/4 players connected', subheadlineStyling);

		numberOfPlayers.anchor.setTo(0.5, 0.5);

		// FUNCTIONS & LISTENERS

		window.game.global.airConsole.onConnect = function(deviceId) {
			let playerNum = window.game.global.playerManager.getConnectedPlayerNum();

			if(playerNum === 4) {
				// too many players -> connected device cannot join game
				window.game.global.playerManager.sendMessageToPlayer(deviceId, {
					screen: 'defaults',
					action: 'too_many_players'
				});
			}
			if(playerNum < 4) {
				window.game.global.playerManager.addPlayer(deviceId);
				updateScreen();
				playerNum += 1;
			}
			if (playerNum === 4) {
				const masterId = window.game.global.playerManager.getMaster();

				touchToContinue.text = 'Master Player (' + window.game.global.playerManager.getNickname(masterId) + ') please tap on Touchscreen to continue';
				window.game.global.playerManager.sendMessageToPlayer(masterId,
					{
						screen: 'waiting',
						action: 'touch_to_continue'
					});
			}
		};

		window.game.global.airConsole.onDisconnect = function(deviceId) {
			// if max player num was already reached & text appeared on screen
			if (window.game.global.playerManager.getConnectedPlayerNum() === 4) {
				const masterId = window.game.global.playerManager.getMaster();

				touchToContinue.text = '';
				window.game.global.playerManager.sendMessageToPlayer(masterId,
					{
						screen: 'waiting',
						action: 'touch_to_continue_abort'
					});
			}
			window.game.global.playerManager.removePlayer(deviceId);
			updateScreen();

			// TODO: remove touch event from master device -> because no longer able to continue
		};

		window.game.global.airConsole.onMessage = function(deviceId, data) {
			switch(data.action) {
			case 'start_character_selection':
				window.game.global.airConsole.broadcast({
					screen: 'waiting',
					action: 'characterSelection'
				});
				that.state.start('CharacterSelection');
				break;
			default:
			}
		};

		function updateScreen() {
			numberOfPlayers.text = window.game.global.playerManager.getConnectedPlayerNum() + '/4 players connected';
			playerNames.text = window.game.global.playerManager.getAllNicknames().toString();
		}
	}

	update() {
		// blinking effect on screen
		if(window.game.global.playerManager.getConnectedPlayerNum() >= 4) {
			this.timer += this.time.elapsed;
			if(this.timer >= 1000) {
				this.timer -= 1000;
				this.touchToContinue.alpha = this.touchToContinue.alpha === 0.5 ? 1 : 0.5;
			}
		}

		// particle visibility (fading in and out)
		this.glowingParticles.updateVisibility();
	}
}
