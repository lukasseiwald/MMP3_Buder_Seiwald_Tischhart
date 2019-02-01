export default class PlayerManager {
  constructor(){

    this.players = new Map();
    this.master = undefined;
    this.setConnectedPlayers();
  }

  getMaster() {
    return this.master;
  }

  getPlayers() {
    return this.players;
  }

  setConnectedPlayers() {
    for (let deviceId of window.game.global.airConsole.getControllerDeviceIds()) {
      this.addPlayer(deviceId);
    }
  }

  setCharacter(deviceId, character) {
    let player = this.getPlayer(deviceId);
    player.character = character;
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
    this.master = window.game.global.airConsole.getMasterControllerDeviceId();

    let player = {
      deviceId,
      nickname: window.game.global.airConsole.getNickname(deviceId),
      character: undefined
    }

    this.players.set(deviceId, player);
  }

  removePlayer(deviceId){
    if (this.players.has(deviceId)) {
      this.players.delete(deviceId)
    }
  }

  getNickname(deviceId) {
    return this.players.get(deviceId).nickname;
  }

  getAllNicknames(){
    let names = new Array();
    for (let [deviceId, player] of this.players){
      names.push(player.nickname);
    }
    return names;
  }

  getCharacter(){

  }

  getConnectedPlayerNum(){
    return this.players.size;
  }

  sendMessageToPlayer(deviceId, data) {
    window.game.global.airConsole.message(deviceId, data);
  }

  broadcast(data) {
    window.game.global.airConsole.broadcast(data);
  }
}
