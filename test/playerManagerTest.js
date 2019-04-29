let assert = require('assert');

class PlayerManager {
  constructor(){
    this.players = new Map();
    this.master = undefined;
  }

  getMaster() {
    return this.master;
  }

  getPlayers() {
    return this.players;
  }

  setCharacter(deviceId, character) {
    let player = this.getPlayer(deviceId);
    player.character = character;
    this.players.set(deviceId, player);
  }

  setSkin(deviceId, skin) {
    let player = this.getPlayer(deviceId);
    player.skin = skin;
    this.players.set(deviceId, player);
  }

  getPlayer(deviceId) {
    return this.players.get(deviceId);
  }

  getPlayerCharacter(deviceId) {
    let character = this.getPlayer(deviceId).character;
    return this.getPlayer(deviceId).character;
  }

  addPlayer(deviceId){
    //this.master = window.game.global.airConsole.getMasterControllerDeviceId();

    let player = {
      deviceId,
      //nickname: window.game.global.airConsole.getNickname(deviceId),
      skin: undefined,
      character: undefined
    }

    this.players.set(deviceId, player);
  }

  removePlayer(deviceId){
    if (this.players.has(deviceId)) {
      this.players.delete(deviceId)
    }
  }

  getConnectedPlayerNum(){
    return this.players.size;
  }
}

let playerManager = new PlayerManager();

describe('playerManager Tests', function() {
  describe('when adding player size should increase', function() {
    it('should return 1', function() {
      playerManager.addPlayer(5);
      assert.equal(playerManager.getConnectedPlayerNum(), 1);
    });
    it('should return 2', function() {
      playerManager.addPlayer(4);
      assert.equal(playerManager.getConnectedPlayerNum(), 2);
    });
  });
  describe('when adding skin to player skin should be set in manager', function() {
    it('should return egypt', function() {
      playerManager.setSkin(5, 'egypt');
      assert.equal(playerManager.getPlayer(5).skin, 'egypt');
    });
    it('should return knight', function() {
      playerManager.setSkin(4, 'knight');
      assert.equal(playerManager.getPlayer(4).skin, 'knight');
    });
  });
  describe('when removing player size should decrease', function() {
    it('should return 1', function() {
      playerManager.removePlayer(5);
      assert.equal(playerManager.getConnectedPlayerNum(), 1);
    });
    it('should return 0', function() {
      playerManager.removePlayer(4);
      assert.equal(playerManager.getConnectedPlayerNum(), 0);
    });
  });
});
