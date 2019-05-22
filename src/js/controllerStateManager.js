export default class ControllerStateManager {
	constructor(containerId) {
		this.states = new Map();
		this.currentState = undefined;
		this.container = document.getElementById(containerId);
	}

	setState(name, stateId) {
		const node = document.getElementById(stateId);

		this.states.set(name, node);
		node.parentNode.removeChild(node);
	}

	startState(name) {
		if (this.currentState) {
			const prev = this.states.get(this.currentState);

			prev.parentNode.removeChild(prev);
		}
		this.currentState = name;
		this.container.appendChild(this.states.get(name));
	}
}
