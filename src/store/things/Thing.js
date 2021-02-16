import * as actionTypes from "./actionTypes";

/* eslint
    class-methods-use-this: ["error", { "exceptMethods": ["activate", "deactivate", "processMessage", "processAction", "exposeState"] }]
    no-unused-vars: 0
*/

/**
 * Base class for implementing particular thing types.
 */
export class Thing {
  /**
   * Create effective configuration (with default values) from provided configuration.
   * @param {Object} config - configuration of thing instance.
   * @return {Object} configuration of thing instance with default values.
   */
  static createEffectiveConfig(config) {
    return config;
  }

  /**
   * Create initial internal state of a thing.
   * @param {Object} config - configuration of thing instance.
   * @return {Object} initial internal state of thing instance.
   */
  static createInitialState(config) {
    return {};
  }

  /**
   * Constructs the thing.
   * @param {string} thingId - id of the thing.
   * @param {Function} getThingState - a function returning full state of the thing.
   * @param {?Function} dispatch - a dispatch function of the global store, if available.
   */
  constructor(thingId, getThingState, dispatch = null) {
    this._thingId = thingId;
    this._getThingState = getThingState;
    this._dispatch = dispatch;
    this._thingState = null;
  }

  /**
   * Configuration properties of thing.
   * @return {Object}
   */
  get config() {
    this._ensureState();
    return this._thingState.config.properties || {};
  }

  /**
   * Internal state of thing.
   * @return {Object}
   */
  get state() {
    this._ensureState();
    return this._thingState.internalState;
  }

  /**
   * Id of the thing.
   * @return {string}
   */
  get thingId() {
    return this._thingId;
  }

  _ensureState() {
    if (this._thingState === null) {
      this._thingState = this._getThingState();
    }
  }

  /**
   * Dispatch action globally.
   * @param action an action to be dispatched.
   * @returns {*}
   */
  dispatch(action) {
    this._thingState = null;
    return this._dispatch(action);
  }

  /**
   * Dispatch action locally as a thing action.
   * @param action the thing action.
   * @returns {*}
   */
  localDispatch(action) {
    this._thingState = null;
    return this._dispatch({
      type: actionTypes.HANDLE_THING_ACTION,
      payload: {
        thingId: this._thingId,
        type: action.type,
        payload: action.payload,
      },
    });
  }

  /**
   * Return action that activates the thing.
   */
  activate() {}

  /**
   * Return action that deactivates the thing.
   */
  deactivate() {}

  /**
   * Handle received message.
   */
  processMessage(message) {}

  /**
   * Handle received action.
   */
  processAction(action) {}

  /**
   * Reduce an action: expose state and return new thing state.
   * @param action
   */
  reduceAndExpose(action) {
    this._ensureState();
    const thingState = this._thingState;
    const internalState = this.reduce(action);
    if (internalState === thingState.internalState) {
      return this._thingState;
    }

    this._thingState = {
      ...thingState,
      internalState,
    };
    const exposedState = this.exposeState();
    return {
      ...thingState,
      internalState,
      state: exposedState,
    };
  }

  /**
   * Return new state of thing after action is handled.
   */
  reduce(action) {
    return this.state;
  }

  /**
   * Return public (exposed) state of the thing.
   */
  exposeState() {
    return {};
  }
}

export default Thing;
