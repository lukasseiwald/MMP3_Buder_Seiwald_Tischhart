/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import lang from '../lang'

export default class extends Phaser.State {
  init() { }
  preload() {
    this.load.spritesheet('dude', '../../assets/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.airconsole = new AirConsole()

    this.player = this.game.add.sprite(100, 450, 'dude');
    this.game.physics.enable([this.player], Phaser.Physics.ARCADE);

    this.player.body.collideWorldBounds = true;
    this.player.body.bounce.set(0.9);
  }

  update() {
    let mushroom = this.mushroom
    let player = this.player
    this.airconsole.onMessage = function(device_id, data) {

      if (data.move !== undefined && data.move === 'right') {
        player.x += 4
      }
      else if (data.move !== undefined && data.move === 'left') {
        player.x -= 4
      }
      else
      {
        player.body.velocity.setTo(0, player.body.velocity.y);
      }
    };
  }

  render() {
    if (__DEV__) {

    }
  }
}
