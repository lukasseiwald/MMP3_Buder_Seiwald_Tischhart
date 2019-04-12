import Phaser from 'phaser'

export default class Item {
    constructor () {
      let unit = window.game.global.unit;
      let scale = window.game.global.scale;
      //random Item
      let itemTypes = ['shield_item'];
      let randomItem = itemTypes[Math.floor(Math.random()*itemTypes.length)];

      if(window.game.global.itemPositions.length == 0) { //wenn schon alle Positionen verwendet wurden
        window.game.global.itemPositions =  [
          {x: 10.5 * unit, y: 16 * unit},
          {x: 13.5 * unit, y: 7 * unit},
          {x: 3 * unit, y: 4 * unit},
          {x: 18 * unit, y: 13 * unit},
          {x: 19 * unit, y: 28 * unit},
          {x: window.game.world.width - 10.5 * unit, y: 16 * unit},
          {x: window.game.world.width - 13.5 * unit, y: 7 * unit},
          {x: window.game.world.width - 3 * unit, y: 4 * unit},
          {x: window.game.world.width - 18 * unit, y: 13 * unit},
          {x: window.game.world.width - 19 * unit, y: 28 * unit},
          {x: window.game.world.width/2, y: 3 * unit},
          {x: window.game.world.width/2, y: 9 * unit},
          {x: window.game.world.width/2, y: 21 * unit}
        ];
      }
      let randomItemPosition = window.game.global.itemPositions.pop();

      this.item = game.add.sprite(randomItemPosition.x, randomItemPosition.y, randomItem);
      this.item.scale.setTo(scale, scale);

      this.item.enableBody = true;

      window.game.physics.p2.enable(this.item);
      this.item.body.setCircle(20);
      this.item.physicsBodyType = Phaser.Physics.P2JS;

      this.item.body.static = true;
      this.item.body.immovable = true;
      this.item.body.moves = false;
      //this.item.scale.setTo(1.3, 1.3); //Item Size

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

    createItems() {
      this.powerItem = new Item();
    }
}
