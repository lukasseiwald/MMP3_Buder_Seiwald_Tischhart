/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'
import lang from '../lang'

export default class extends Phaser.State {
  init() { }
  preload() {
    this.load.spritesheet('dude', '../../assets/dude.png', 48, 48, 48); 
  }

  create() {
    this.airconsole = new AirConsole()

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Players
    this.players = this.game.add.group();
    this.players.enableBody = true;

    //Player 1
    this.player1 = this.createPlayer(800, 550, 'dude', false, 650, 210);  //x, y, skin, facingRight?, jump (jumpHeight), velocity (runningSpeed)
    this.player1.enableBody = true;

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
    //let mushroom = this.mushroom
    let player = this.player1

    this.airconsole.onMessage = function(device_id, data) {
      // let player = airconsole.convertDeviceIdToPlayerNumber(device_id);
      if (data.move !== undefined && data.move === 'right') {
        //player.animations.play('left');
        player.facingRight = false; 
        player.body.velocity.x = -player.v;
        // player.animations.play('right', true);
      }
      else if (data.move !== undefined && data.move === 'left') {
        //player.animations.play('right');
        player.facingRight = true; 
        player.body.velocity.x = player.v;
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

  createPlayer(x,y,skin,facingRight,jump,velocity) {

    var player = this.players.create(x,y, skin);

    //cover floor with tiles
   
    player.body.gravity.y = 500;
    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    player.body.setSize(28, 45);

    player.j = jump;
    player.v = velocity;
    player.facingRight = facingRight
    player.attack = false;

    player.animations.add('idleRight', [32,33,34,35], 12, true);
    player.animations.add('idleLeft', [0,1,2,3], 12, true);
    player.animations.add('left', [8,9,10,11,12,13,14,15], 12, true);
    player.animations.add('right', [41,42,43,44,45,46,47,48], 12, true);
    player.animations.add('attackRight', [16,17,18,19], 12, false);
    player.animations.add('attackLeft', [20,21,22,23], 12, false);
    player.animations.add('duck', [26,27,28,29,30], 12, true);
    player.animations.add('jump', [37], 20, true);
    player.animations.add('die', [38], 9, true);

    player.animations.play('idleRight');

    return player;
  }

  render() {
    if (__DEV__) {
      
    }
  }
}
