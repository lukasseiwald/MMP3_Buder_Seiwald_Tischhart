import Phaser from 'phaser'

export default class Base {

  constructor (x, y, asset) {
    this.base = game.add.sprite(x , y, asset);
    this.base.enableBody = true;

    window.game.physics.p2.enable(this.base);
    this.base.physicsBodyType = Phaser.Physics.P2JS;

    this.base.body.static = true;
    this.base.collectedSouls = []; //maybe already write in player soul, and check if alreadyCollectedSoul != newSoul


    //make Base face right direction and size
    if(x > 600) {
      this.base.scale.setTo(-0.72,0.72);
    }
    else {
      this.base.scale.setTo(0.72,0.72);
    }

    //Collisions for Souls
    let baseCollisionGroup = window.game.physics.p2.createCollisionGroup();
    baseCollisionGroup.mask = 64;
    let soulCollisionGroup = window.game.physics.p2.createCollisionGroup();
    soulCollisionGroup.mask = 32;
    let playerCollisionGroup = window.game.physics.p2.createCollisionGroup();
    playerCollisionGroup.mask = 4;

    this.base.body.setCollisionGroup(baseCollisionGroup);
    this.base.body.collides(soulCollisionGroup, this.basedSoul, this);
    this.base.body.collides(playerCollisionGroup, this.basedPlayer, this);
  }

  basedSoul(base, soul) {
    let soulName = soul.sprite.key;
    if(!this.base.collectedSouls.includes(soulName)) {
      this.winning();

      // this.base.collectedSouls.push(soulName);
      // if(this.base.collectedSouls > 0) {
      //   let style = { font: "65px Bungee", fill: "#000000", align: "center" };
      //   window.game.add.text(500, 500, "Player Won", style);
      //   window.game.time.events.add(Phaser.Timer.SECOND * 5, this.winning, this);
      // }
    }
    else {
      console.log("soul already included");
    }
  }

  basedPlayer(base, player) {
    console.log("player in base");
    player.obtainedSoul = null;
  }

  winning() {
    let style = { font: "65px Bungee", fill: "#000000", align: "center" };
    let winner = this.base.key.split("_");
    let winningText = winner[0] + " WON";

    window.game.add.text(550, 300, winningText, style);
    window.game.time.events.add(Phaser.Timer.SECOND * 5, this.won, this);
  }
  won() {
    window.game.state.start('Level1')
  }
}
