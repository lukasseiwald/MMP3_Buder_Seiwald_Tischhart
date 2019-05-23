import Phaser from 'phaser';
import WebFont from 'webfontloader';
import config from '../config';

export default class extends Phaser.State {
	init() {
		this.stage.backgroundColor = '#EDEEC9';
		this.fontsReady = false;
		this.fontsLoaded = this.fontsLoaded.bind(this);

		// stop game from pausing when game window is not in focus
		this.stage.disableVisibilityChange = true;
	}

	preload() {
		// this.game.world.setBounds(0, 0, this.game.world.width, this.game.world.bounds.bottom+150);

		// LOAD BACKGROUND
		this.load.image('background1', '../../assets/images/background/BG-1.png');
		this.load.image('background2', '../../assets/images/background/BG-2.png');
		this.load.image('background3', '../../assets/images/background/BG-3.png');
		this.load.image('smoke', '../../assets/images/background/smoke.png');

		// LOAD CHARACTER SELECTION IMAGES
		this.load.image('backgroundCharacterSelection', '../../assets/images/characterSelection/characterSelectionFrame.png');
		this.load.image('characterPlateau', '../../assets/images/characterSelection/characterPlateau.png');

		// LOAD TILES
		this.load.spritesheet('tiles', '../../assets/tileMap/tileSet2.png', 33, 33, 12, 0, 4);

		// LOAD BASES
		this.load.image('egyptian_base', '../../assets/bases/egyptian_base.png');
		this.load.image('knight_base', '../../assets/bases/knight_base.png');
		this.load.image('lucifer_base', '../../assets/bases/lucifer_base.png');
		this.load.image('kickapoo_base', '../../assets/bases/kickapoo_base.png');
		this.load.image('inca_base', '../../assets/bases/inca_base.png');
		this.load.image('mage_base', '../../assets/bases/mage_base.png');

		// LOAD PLAYERS
		this.load.atlasJSONHash('egyptian', '../../assets/characters/egyptian/egyptian.png', '../../assets/characters/egyptian/egyptian.json');
		this.load.atlasJSONHash('knight', '../../assets/characters/knight/knight.png', '../../assets/characters/knight/knight.json');
		this.load.atlasJSONHash('lucifer', '../../assets/characters/lucifer/lucifer.png', '../../assets/characters/lucifer/lucifer.json');
		this.load.atlasJSONHash('kickapoo', '../../assets/characters/kickapoo/kickapoo.png', '../../assets/characters/kickapoo/kickapoo.json');
		this.load.atlasJSONHash('inca', '../../assets/characters/inca/inca.png', '../../assets/characters/inca/inca.json');
		this.load.atlasJSONHash('mage', '../../assets/characters/mage/mage.png', '../../assets/characters/mage/mage.json');

		// LOAD SOULS
		this.load.spritesheet('egyptian_soul', '../../assets/characters/egyptian/egyptian_soul.png', 50, 50, 2);
		this.load.spritesheet('knight_soul', '../../assets/characters/knight/knight_soul.png', 50, 50, 2);
		this.load.spritesheet('lucifer_soul', '../../assets/characters/lucifer/lucifer_soul.png', 50, 50, 2);
		this.load.spritesheet('kickapoo_soul', '../../assets/characters/kickapoo/kickapoo_soul.png', 50, 50, 2);
		this.load.spritesheet('inca_soul', '../../assets/characters/inca/inca_soul.png', 50, 50, 2);
		this.load.spritesheet('mage_soul', '../../assets/characters/mage/mage_soul.png', 50, 50, 2);

		// LOAD BULLETS
		this.load.image('egyptian_bullet', '../../assets/characters/egyptian/egyptian_bullet.png');
		this.load.image('knight_bullet', '../../assets/characters/knight/knight_bullet.png');
		this.load.image('lucifer_bullet', '../../assets/characters/lucifer/lucifer_bullet.png');
		this.load.image('kickapoo_bullet', '../../assets/characters/kickapoo/kickapoo_bullet.png');
		this.load.image('inca_bullet', '../../assets/characters/inca/inca_bullet.png');
		this.load.image('mage_bullet', '../../assets/characters/mage/mage_bullet.png');

		// LOAD ITEMS
		this.load.spritesheet('health_item', '../../assets/items/health.png', 50, 50, 5);
		this.load.spritesheet('jump_item', '../../assets/items/jump.png', 50, 50, 7);
		this.load.spritesheet('speed_item', '../../assets/items/speed.png', 50, 50, 4);
		this.load.spritesheet('shield_item', '../../assets/items/shield.png', 50, 50, 5);
		this.load.image('shield_character', '../../assets/items/shield2.png');

		// LOAD EMOTES
		this.load.spritesheet('curseEmote', '../../assets/images/emotes/curseEmote.png', 50, 50, 10);
		this.load.spritesheet('meatEmote', '../../assets/images/emotes/meatEmote.png', 50, 50, 10);
		this.load.spritesheet('fingerEmote', '../../assets/images/emotes/fingerEmote.png', 50, 50, 10);
		this.load.spritesheet('frogEmote', '../../assets/images/emotes/frogEmote.png', 50, 50, 10);

		// LOAD EXTRAS
		this.load.image('crown', '../../assets/extras/crown.png');
		this.load.spritesheet('dash_smoke', '../../assets/extras/dash_smoke.png', 60, 60, 9);

		if(config.webfonts.length) {
			WebFont.load({
				google: {
					families: config.webfonts
				},
				active: this.fontsLoaded
			});
		}
	}

	render() {
		if (config.webfonts.length && this.fontsReady) {
			this.state.start('Splash');
		}
		if (!config.webfonts.length) {
			this.state.start('Splash');
		}
	}

	fontsLoaded() {
		this.fontsReady = true;
	}
}
