export default class controllerStateManager {
  constructor(containerId) {
    this.states = new Map();
    this.currentState = undefined;
    this.container = document.getElementById(containerId);
  }

  setState(name, stateId) {
    let node = document.getElementById(stateId);
    this.states.set(name, node);
    node.parentNode.removeChild(node);
  }

  startState(name) {
    if (this.currentState) {
      let prev = this.states.get(this.currentState);
      prev.parentNode.removeChild(prev);
    }

    this.currentState = name;
    this.container.appendChild(this.states.get(name));
  }
}