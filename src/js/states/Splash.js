import Phaser from 'phaser';

export default class extends Phaser.State {
	create () {
		window.game.global.dev = true;
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
