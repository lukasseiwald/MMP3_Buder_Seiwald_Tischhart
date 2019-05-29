import Phaser from 'phaser';

export default class extends Phaser.State {
	create () {
		// Audio
		window.game.global.bgMusic = window.game.add.audio('bg_music', 0.4, true);
		window.game.global.bgMusic.play();
		window.game.global.countdownAudio = window.game.add.audio('countdown', 1, false);
		window.game.global.hitAudio = window.game.add.audio('hit', 0.1, false);
		window.game.global.hurtAudio = window.game.add.audio('hurt', 0.3, false);
		window.game.global.healthAudio = window.game.add.audio('health');
		window.game.global.jumpAudio = window.game.add.audio('jump', 0.3, false);
		window.game.global.impactAudio = window.game.add.audio('impact', 0.2, false);
		window.game.global.collectedSoulAudio = window.game.add.audio('collected_soul', 0.3, false);
		window.game.global.shieldAudio = window.game.add.audio('shield', 0.3, false);
		window.game.global.dyingAudio = window.game.add.audio('dying', 0.3, false);
		const throwAudio1 = window.game.add.audio('throw1', 0.3, false);
		const throwAudio2 = window.game.add.audio('throw2', 0.3, false);
		const throwAudio3 = window.game.add.audio('throw3', 0.3, false);

		window.game.global.throwAudio = [throwAudio1, throwAudio2, throwAudio3];

		window.game.global.dev = false;
		window.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
		window.game.global.healthBars = [];

		if(window.game.global.dev) {
			this.state.start('Level1');
		}
		else {
			this.state.start('Waiting');
		}
	}
}
