import PreBootState from './states/PreBoot';
import BootState from './states/Boot';
import CharacterSelection from './states/CharacterSelection';
import Level1 from './levels/Level1';
import Phaser from 'phaser';
import Score from './states/Score';
import SplashState from './states/Splash';
import Waiting from './states/Waiting';

class Game extends Phaser.Game {
	constructor () {
		super(1848, 1023, Phaser.AUTO, 'content', null);

		this.state.add('PreBoot', PreBootState, false);
		this.state.add('Boot', BootState, false);
		this.state.add('Splash', SplashState, false);
		this.state.add('Waiting', Waiting, false);
		this.state.add('CharacterSelection', CharacterSelection, false);
		this.state.add('Level1', Level1, false);
		this.state.add('Score', Score, false);
		this.state.start('PreBoot');
	}
}

export default Game;
