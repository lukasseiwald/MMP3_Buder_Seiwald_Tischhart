import Phaser from 'phaser';

export default class extends Phaser.State {
	create () {
		// Audio
		window.game.global.bgMusic = window.game.add.audio('bg_music', 0.3, true);
		window.game.global.lavaAudio = window.game.add.audio('lava', 0.3, true);
		window.game.global.lavaAudio.play();
		window.game.global.countdownAudio = window.game.add.audio('countdown', 0.7, false);
		window.game.global.hellAudio = window.game.add.audio('hell', 0.6, false);
		window.game.global.impactAudio = window.game.add.audio('impact', 0.2, false);
		const throwAudio1 = window.game.add.audio('throw1', 0.3, false);
		const throwAudio2 = window.game.add.audio('throw2', 0.3, false);
		const throwAudio3 = window.game.add.audio('throw3', 0.3, false);

		window.game.global.throwAudio = [throwAudio1, throwAudio2, throwAudio3];

		window.game.global.dev = false;
		window.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;

		if(window.game.global.dev) {
			this.state.start('Level1');
		}
		else {
			this.state.start('Waiting');
		}
	}
}
