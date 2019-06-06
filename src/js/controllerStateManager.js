export default class ControllerStateManager {
	constructor(containerId) {
		this.states = new Map();
		this.currentState = undefined;
		this.container = document.getElementById(containerId);
	}

	setState(name, stateId) {
		const node = document.getElementById(stateId);
		const clone = node.cloneNode(true);

		this.states.set(name, clone);
		node.parentNode.removeChild(node);
	}

	startState(name) {
		if (this.currentState) {
			const prev = document.getElementById('state--' + this.currentState);

			prev.parentNode.removeChild(prev);
		}
		this.currentState = name;
		const currNode = this.states.get(name);

		this.container.appendChild(currNode.cloneNode(currNode));
	}
}
