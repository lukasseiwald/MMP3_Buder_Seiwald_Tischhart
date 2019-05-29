import Phaser from 'phaser';

export default class Base {
	constructor (tsize, x, y, asset, character) {
		this.unit = window.game.global.unit;
		this.scale = window.game.global.scale;
		this.character = character;
		this.base = window.game.add.sprite(x, y, asset);
		this.base.enableBody = true;
		this.base.anchor.y = 0.5;

		this.base.width = tsize * 5.2;
		this.base.height = tsize * 5.2;

		window.game.physics.p2.enable(this.base);
		this.base.physicsBodyType = Phaser.Physics.P2JS;

		if(x > window.game.width / 2) {
			this.base.scale.x = this.base.scale.x * -1;
		}

		this.base.body.static = true;
		this.base.body.immovable = true;
		this.base.body.moves = false;
		const skinName = asset.split('_')[0] + '_soul';

		// maybe already write in player soul, and check if alreadyCollectedSoul != newSoul
		this.base.collectedSouls = [skinName];
		// Collisions for Souls
		const baseCollisionGroup = window.game.physics.p2.createCollisionGroup();
		const soulCollisionGroup = window.game.physics.p2.createCollisionGroup();

		baseCollisionGroup.mask = 64;
		soulCollisionGroup.mask = 32;

		this.base.body.setCollisionGroup(baseCollisionGroup);
		this.base.body.collides(soulCollisionGroup, this.basedSoul, this);
	}

	basedSoul(base, soul) {
		if(base) {
			const soulName = soul.sprite.key;

			// still doesnt see it properly     ! > -1
			if(base.sprite.collectedSouls.indexOf(soulName) < 0) {
				this.player = soul.obtainedBy;
				if(this.player !== undefined) {
					// Base only accepts Souls from own Player
					if(this.player.key !== base.sprite.key.split('_')[0]) {
						return;
					}
					base.sprite.collectedSouls.push(soulName);
					// Syncing player collectedSouls with base for avoiding errors
					this.player.collectedSouls = base.sprite.collectedSouls;
					// adding Soul to the Base Soul Collection
					this.addSoulSpriteToCollection(soulName);
					this.player.obtainedSoul = null;
					// base.sprite.collectedSouls.push(soulName);
					soul.sprite.kill();
				}
			}

			if(base.sprite.collectedSouls.length > 1) {
				this.winning();
			}
		}
	}

	addSoulSpriteToCollection(soulName) {
		const spacingForCollectionStyle = this.base.collectedSouls.length - 1;
		let soulTrophyX;

		if(this.base.x < window.game.world.width / 2) {
			soulTrophyX = this.unit - 10;
		}
		else {
			soulTrophyX = window.game.world.width - 2 * this.unit;
		}
		const soulTrophY = this.base.y - 3.7 * this.unit + 0.8 * this.unit * spacingForCollectionStyle * 2;
		// anders bennen da es sonst als eingesammelte seele zählt
		const test = window.game.add.sprite(soulTrophyX, soulTrophY, soulName);

		test.scale.setTo(this.scale, this.scale);
		// soul.scale.setTo(this.scale, this.scale);
	}

	winning() {
		let winningText = 'Player Won';
		const style = { font: 2 * this.unit + 'px Bungee', fill: '#000000', align: 'center' };

		if(!window.game.global.dev) {
			winningText = window.game.global.playerManager.getNickname(this.character.deviceId) + ' WON THE ROUND';

			const winnerId = this.character.deviceId;

			window.game.global.playerManager.sendMessageToPlayer(winnerId,
				{
					screen: 'game',
					action: 'winning'
				});

			for (let [deviceId, player] of window.game.global.playerManager.getPlayers()) {
				if (deviceId !== winnerId) {
					window.game.global.playerManager.sendMessageToPlayer(deviceId,
						{
							screen: 'game',
							action: 'loosing'
						});
				}
			}
			// For Testing
			window.game.global.playerManager.incrementScore(this.character.deviceId);
			if(window.game.global.playerManager.getScore(this.character.deviceId) > 0) {
				window.game.global.winner = this.character.deviceId;
			}
			const test = window.game.add.text(window.game.world.centerX, window.game.world.centerY - this.unit * 2, winningText, style);

			test.anchor.setTo(0.5, 0.5);
			this.pauseGame();
		}
		else {
			window.game.state.start('Level1');
		}
	}

	async pauseGame() {
		window.game.paused = true;
		while(window.game.paused) {
			await this.pauseTimer();
			window.game.paused = false;
			this.won();
		}
	}

	pauseTimer() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 4000);
		});
	}

	won() {
		if(!window.game.global.dev) {
			window.game.global.airConsole.broadcast({
				screen: 'game',
				action: 'emotes'
			});
			window.game.state.start('Score');
		}
		else {
			window.game.state.start('Score');
		}
	}
}
