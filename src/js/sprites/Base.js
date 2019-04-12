import Phaser from 'phaser'
import { headlineStyling } from '../stylings'
import { addImage } from '../utils'

export default class Base {

  constructor (tsize, x, y, asset, character) {
    this.unit = window.game.global.unit;
    this.scale = window.game.global.scale;
    this.character = character;
    this.base = game.add.sprite(x, y, asset);
    this.base.enableBody = true;
    this.base.anchor.y = .5;


    this.base.width = tsize * 5.2;
    this.base.height = tsize * 5.2;

    window.game.physics.p2.enable(this.base);
    this.base.physicsBodyType = Phaser.Physics.P2JS;

    if(x > window.game.width/2) {
      this.base.scale.x = this.base.scale.x * -1;
    }

    this.base.body.static = true;
    this.base.body.immovable = true;
    this.base.body.moves = false;
    let skinName = asset.split("_")[0] + "_soul";
    this.base.collectedSouls = [skinName]; //maybe already write in player soul, and check if alreadyCollectedSoul != newSoul

    //make Base face right direction and size

    //Collisions for Souls
    let baseCollisionGroup = window.game.physics.p2.createCollisionGroup();
    baseCollisionGroup.mask = 64;
    let soulCollisionGroup = window.game.physics.p2.createCollisionGroup();
    soulCollisionGroup.mask = 32;

    this.base.body.setCollisionGroup(baseCollisionGroup);
    this.base.body.collides(soulCollisionGroup, this.basedSoul, this);
  }

  basedSoul(base, soul) {
    if(base) {
      let soulName = soul.sprite.key;

      if(base.sprite.collectedSouls.indexOf(soulName) < 0) { //still doesnt see it properly     ! > -1
        this.player = soul.obtainedBy;
        if(this.player != undefined) {
          if(this.player.key !== base.sprite.key.split("_")[0]) { //Base only accepts Souls from own Player
            return;
          }
          base.sprite.collectedSouls.push(soulName);
          this.player.collectedSouls = base.sprite.collectedSouls; //Syncing player collectedSouls with base for avoiding errors
          this.addSoulSpriteToCollection(soulName); //adding Soul to the Base Soul Collection
          this.player.obtainedSoul = null;
          base.sprite.collectedSouls.push(soulName);
          soul.sprite.kill();
        }
      }
      else {
        console.log("soul already included");
      }
      if(base.sprite.collectedSouls.includes("kickapoo_soul") && base.sprite.collectedSouls.includes("lucifer_soul") && base.sprite.collectedSouls.includes("egyptian_soul") && base.sprite.collectedSouls.includes("knight_soul")) {
        if(window.game.global.dev) {
          window.game.state.start('Level1');
        }
        else {
          this.winning();
          window.game.time.events.add(Phaser.Timer.SECOND * 5, this.winning, this);
        }
      }
    }
  }

  addSoulSpriteToCollection(soulName) {
    let spacingForCollectionStyle = this.base.collectedSouls.length - 1;
    let soulTrophyX, soulTrophY;
    if(this.base.x < window.game.world.width/2) {
      soulTrophyX = this.unit;
    }
    else {
      soulTrophyX = window.game.world.width - 2 * this.unit;
    }
    soulTrophY = this.base.y - 3 * this.unit + .8 * this.unit * spacingForCollectionStyle;
    let test = window.game.add.sprite(soulTrophyX, soulTrophY , soulName); //anders bennen da es sonst als eingesammelte seele zählt
    test.scale.setTo(this.scale, this.scale);
    //soul.scale.setTo(this.scale, this.scale);

  }

  winning() {
    let style = { font: 2 * this.unit + "px Bungee", fill: "#000000", align: "center" };
    let winningText = window.game.global.playerManager.getNickname(this.character.deviceId) + " WON";

    let winnerId = this.character.deviceId;
    window.game.global.playerManager.sendMessageToPlayer(winnerId,
    {
      screen: 'game',
      action: 'winning'
    });

    this.image = addImage(window.game, 0, 0, 'background1', window.game.world.width, window.game.world.height);

    let test = window.game.add.text(window.game.world.centerX, window.game.world.centerY, winningText, headlineStyling);
    test.anchor.setTo(0.5, 0.5);

    for (let [deviceId, player] of window.game.global.playerManager.getPlayers()) {
      if (deviceId !== winnerId) {
        window.game.global.playerManager.sendMessageToPlayer(deviceId,
        {
          screen: 'game',
          action: 'loosing'
        });
      }
    }
    window.game.time.events.add(Phaser.Timer.SECOND * 5, this.won, this);
  }

  won() {
    this.image.destroy();
    window.game.global.playerManager.broadcast({screen: 'game', action: 'restart'});
    window.game.state.start('Level1');
  }
}
