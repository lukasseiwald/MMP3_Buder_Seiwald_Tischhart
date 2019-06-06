import Phaser from 'phaser';

export default class extends Phaser.State {
	preload() {
		this.load.image('preloadLogo', '../../assets/images/preBoot/logo.png');
		this.load.image('preloadingBar', '../../assets/images/preBoot/loadingBar.png');
	}

	create() {
		this.state.start('Boot');
	}
}
