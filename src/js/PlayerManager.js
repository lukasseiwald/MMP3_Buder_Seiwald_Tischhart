export default class PlayerManager {
	constructor() {
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
		for (const deviceId of window.game.global.airConsole.getControllerDeviceIds()) {
			this.addPlayer(deviceId);
		}
	}

	setCharacter(deviceId, character) {
		const player = this.getPlayer(deviceId);

		player.character = character;
		this.players.set(deviceId, player);
	}

	setSkin(deviceId, skin) {
		const player = this.getPlayer(deviceId);

		player.skin = skin;
		this.players.set(deviceId, player);
	}

	getSkin(deviceId) {
		return this.getPlayer(deviceId).skin;
	}

	setScore(deviceId, score) {
		const player = this.getPlayer(deviceId);

		player.score = score;
		this.players.set(deviceId, player);
	}

	incrementScore(deviceId) {
		const player = this.getPlayer(deviceId);

		player.score += 1;
		this.players.set(deviceId, player);
	}

	getScore(deviceId) {
		return this.players.get(deviceId).score;
	}

	getPlayer(deviceId) {
		return this.players.get(deviceId);
	}

	getPlayerCharacter(deviceId) {
		return this.getPlayer(deviceId).character;
	}

	addPlayer(deviceId) {
		this.master = window.game.global.airConsole.getMasterControllerDeviceId();
		const player = {
			deviceId,
			nickname: window.game.global.airConsole.getNickname(deviceId),
			skin: undefined,
			score: 0,
			character: undefined
		};

		this.players.set(deviceId, player);
	}

	removePlayer(deviceId) {
		if(this.players.has(deviceId)) {
			this.players.delete(deviceId);
		}
	}

	getNickname(deviceId) {
		return this.players.get(deviceId).nickname;
	}

	setNewDeviceID(oldDeviceId, newDeviceId) {
		let player = this.getPlayer(oldDeviceId);

		this.removePlayer(oldDeviceId);
		this.addPlayer(newDeviceId);
		this.setSkin(newDeviceId, player.skin);
		this.setCharacter(newDeviceId, player.character);
		this.setScore(newDeviceId, player.score);
	}

	getAllNicknames() {
		const names = new Array();

		for (const [deviceId, player] of this.players) {
			names.push(player.nickname);
		}
		return names;
	}

	getConnectedPlayerNum() {
		return this.players.size;
	}

	sendMessageToPlayer(deviceId, data) {
		window.game.global.airConsole.message(deviceId, data);
	}

	broadcast(data) {
		window.game.global.airConsole.broadcast(data);
	}
}
