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

    // console.log(this.player)

    // this.player.animations.add({
    //     key: 'left',
    //     frames: [ { key: 'dude', frame: 4 } ],
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.player.animations.add({
    //     key: 'turn',
    //     frames: [ { key: 'dude', frame: 4 } ],
    //     frameRate: 20
    // });

    // this.player.animations.add({
    //     key: 'right',
    //     frames: [ { key: 'dude', frame: 4 } ],
    //     frameRate: 10,
    //     repeat: -1
    // });
  }

  update() {
    let mushroom = this.mushroom
    let player = this.player
    this.airconsole.onMessage = function(device_id, data) {
      console.log(player)
      // let player = airconsole.convertDeviceIdToPlayerNumber(device_id);
      if (data.move !== undefined && data.move === 'right') {
        player.x += 4
        // player.animations.play('right', true);
      }
      else if (data.move !== undefined && data.move === 'left') {
        player.x -= 4
        // player.animations.play('left', true);
      }
      else
      {
          player.body.velocity.setTo(0, player.body.velocity.y);
          // player.animations.play('turn');
      }
      console.log(player.body.velocity)
    };
  }

  render() {
    if (__DEV__) {
      
    }
  }
}
