import Phaser from 'phaser'

export default class Soul {

    constructor () {
        this.soul = null
    }

    spawnSoul(x, y, asset) {
        this.soul = game.add.sprite(x,y,asset);
        this.soul.animations.add('souling', [1,2,3], 10, true);
        this.soul.animations.play('souling');

        this.soul.isPickedUp = false;
        this.soul.isLost = false;

        console.log(window.game);
    }
}