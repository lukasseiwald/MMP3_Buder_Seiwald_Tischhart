import Phaser from 'phaser'
import { headlineStyling } from '../stylings'
import { addImage } from '../utils'

export default class Base {

  constructor (x, y, asset, character) {
    this.character = character;
    this.base = game.add.sprite(x , y, asset);
    this.base.enableBody = true;

    window.game.physics.p2.enable(this.base);
    this.base.physicsBodyType = Phaser.Physics.P2JS;

    this.base.body.static = true;
    this.base.body.immovable = true;
    this.base.body.moves = false;
    let skinName = asset.split("_")[0] + "_soul";
    this.base.collectedSouls = [skinName]; //maybe already write in player soul, and check if alreadyCollectedSoul != newSoul

    //make Base face right direction and size
    if(x > 600) {
      this.base.scale.setTo(-1,1);
    }
    else {
      this.base.scale.setTo(1,1);
    }

    //Collisions for Souls
    let baseCollisionGroup = window.game.physics.p2.createCollisionGroup();
    baseCollisionGroup.mask = 64;
    let soulCollisionGroup = window.game.physics.p2.createCollisionGroup();
    soulCollisionGroup.mask = 32;
    // let playerCollisionGroup = window.game.physics.p2.createCollisionGroup();
    // playerCollisionGroup.mask = 4;

    this.base.body.setCollisionGroup(baseCollisionGroup);
    this.base.body.collides(soulCollisionGroup, this.basedSoul, this);
    //this.base.body.collides(playerCollisionGroup, this.basedPlayer, this);
  }

  basedSoul(base, soul) {
    if(base) {
      let soulName = soul.sprite.key;

      if(base.sprite.collectedSouls.indexOf(soulName) < 0) { //still doesnt see it properly     ! > -1

        this.player = soul.obtainedBy;
        if(this.player != undefined) {

          base.sprite.collectedSouls.push(soulName);
          //Sync player collectedSouls with base for avoiding errors
          console.log(this.player);
          this.player.collectedSouls = base.sprite.collectedSouls;
          console.log(this.player.collectedSouls);
          //adding Soul to the Base Soul Collection
          this.addSoulSpriteToCollection(soulName);

          this.player.carryingSoul = 0;
          base.sprite.collectedSouls.push(soulName);
          soul.sprite.kill();
        }
        console.log("soul without player.... no go");
      }
      else {
        console.log("soul already included");
      }
      if(base.sprite.collectedSouls.includes("kickapoo_soul") && base.sprite.collectedSouls.includes("lucifer_soul") && base.sprite.collectedSouls.includes("egyptian_soul") && base.sprite.collectedSouls.includes("knight_soul")) {
        this.winning();
        let style = { font: "65px Bungee", fill: "#000000", align: "center" };
        //window.game.add.text(500, 500, "Player Won", style);
        window.game.time.events.add(Phaser.Timer.SECOND * 5, this.winning, this);
      }
    }
  }

  addSoulSpriteToCollection(soulName) {
    var spacingForCollectionStyle = this.base.collectedSouls.length - 1;
    let soulTrophyX;
    let soulTrophY
    if(this.base.x < 600) {
      soulTrophyX = this.base.x - 87
    }
    else {
      soulTrophyX = this.base.x + 39
    }
    soulTrophY = this.base.y - 99 + 30 * spacingForCollectionStyle;
    window.game.add.sprite(soulTrophyX, soulTrophY , soulName); //anders bennen da es sonst als eingesammelte seele zählt
  }

  // basedPlayer(base, player) {
  //   console.log("player in base");
  //   player.obtainedSoul = null;
  // }

  winning() {
    let style = { font: "65px Bungee", fill: "#000000", align: "center" };
    let winningText = window.game.global.playerManager.getNickname(this.character.deviceId) + " WON";

    let winnerId = this.character.deviceId;
    window.game.global.playerManager.sendMessageToPlayer(winnerId, {screen: 'game', action: 'winning'});

    this.image = addImage(window.game, 0, 0, 'background1', window.game.world.width, window.game.world.height);

    let test = window.game.add.text(window.game.world.centerX, window.game.world.centerY, winningText, headlineStyling);
    test.anchor.setTo(0.5, 0.5);

    for (let [deviceId, player] of window.game.global.playerManager.getPlayers()) {
      if (deviceId !== winnerId) {
        window.game.global.playerManager.sendMessageToPlayer(deviceId,
          {
            screen: 'game',
            action: 'loosing'
          }
        )
      }
    }
    window.game.time.events.add(Phaser.Timer.SECOND * 5, this.won, this);
  }

  won() {
    this.image.destroy();
    window.game.global.playerManager.broadcast({screen: 'game', action: 'restart'});
    window.game.state.start('Level1')
  }
}
