import Phaser from 'phaser'

export default class Item {
    constructor () {
      //random Item
      let itemTypes = ['health_item', 'jump_item', 'speed_item'];
      var randomItem = itemTypes[Math.floor(Math.random()*itemTypes.length)];

      //random Item Position
      //let itemPositions = [{x: window.game.world.width / 2, y: 100}, {x: window.game.world.width / 2, y: 640}, {x: window.game.world.width / 2, y: 310} ];
      let itemPositions = [{x: 400, y: 500}, {x: 530, y: 200}, {x: 200, y: 150}, {x: 600, y: 850}, {x: 700, y: 450}, {x: window.game.world.width - 430, y: 500}, {x: window.game.world.width - 560, y: 200}, {x: window.game.world.width - 230, y: 150}, {x: window.game.world.width - 630, y: 850}, {x: window.game.world.width - 730, y: 450}, {x: window.game.world.width / 2, y: 100}, {x: window.game.world.width / 2, y: 640}, {x: window.game.world.width / 2, y: 310}];
      var randomItemPosition = itemPositions[Math.floor(Math.random()*itemPositions.length)];
      //console.log(randomItemPosition)

      this.item = game.add.sprite(randomItemPosition.x, randomItemPosition.y, randomItem);
      this.item.enableBody = true;
  
      window.game.physics.p2.enable(this.item);
      this.item.body.setCircle(20);
      this.item.physicsBodyType = Phaser.Physics.P2JS;
  
      this.item.body.static = true;
      this.item.body.immovable = true;
      this.item.body.moves = false;
      //this.item.scale.setTo(1.3, 1.3);

      //Collision For Item
      let itemCollisionGroup = window.game.physics.p2.createCollisionGroup();
      itemCollisionGroup.mask = 128;
      let playerCollisionGroup = window.game.physics.p2.createCollisionGroup();
      playerCollisionGroup.mask = 4;

      this.item.body.setCollisionGroup(itemCollisionGroup);
      this.item.body.collides(playerCollisionGroup, this.collectItem, this);

      this.item.animations.add('item_idle');
      this.item.animations.play('item_idle', 4, true);
    }

    collectItem(item, player) {
      item.sprite.kill();
    }
}