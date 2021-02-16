import * as actionTypes from "./actionTypes";
import thingTypes from "./thingTypes";
import { ThingState } from "./constants";

/**
 * Create things according to provided config.
 *
 * @param config {Object} configuration of things.
 * @returns {Function} action creator.
 */
export const createThings = config => {
  return dispatch => {
    dispatch({ type: actionTypes.CREATE_THINGS, payload: config });
  };
};

/**
 * Attach to a thing, if required, activate the thing.
 * @param thingId id of thing
 */
export const attachThing = thingId => {
  return (dispatch, getState) => {
    const dispatchedAction = dispatch({ type: actionTypes.THING_ATTACHED, payload: { thingId } });
    if (dispatchedAction.result && dispatchedAction.result.activationRequired) {
      const thing = createThingInstance(thingId, getState, dispatch);
      thing.activate();
      dispatch({ type: actionTypes.THING_ACTIVATED, payload: { thingId } });
    }
  };
};

/**
 * Detach from a thing. Thing is not deactivated immediately.
 * @param thingId id of thing.
 */
export const detachThing = thingId => {
  return dispatch => {
    dispatch({
      type: actionTypes.THING_DETACHED,
      payload: { thingId, timestamp: Date.now() },
    });
  };
};

/**
 *  Deactivate all expired things - idle things that time-outed with respect to configuration.
 */
export const deactivateExpiredThings = () => {
  return (dispatch, getState) => {
    while (true) {
      const expiredThingId = findExpiredThing(getState().things);
      if (expiredThingId === null) {
        return;
      }
      deactivateThing(expiredThingId, getState, dispatch);
    }
  };
};

/**
 * Destroy all things.
 */
export const destroyThings = () => {
  return (dispatch, getState) => {
    const thingIds = Object.keys(getState().things);
    thingIds.forEach(thingId => {
      deactivateThing(thingId, getState, dispatch);
    });
  };
};

/**
 * Handle mqtt message by all things.
 * @param message received message to be handled.
 */
export const processMessage = message => {
  return (dispatch, getState) => {
    const thingIds = Object.keys(getState().things);
    thingIds.forEach(thingId => {
      const thingInstance = createThingInstance(thingId, getState, dispatch);
      thingInstance.processMessage(message);
    });
  };
};

/**
 * Handle action message by provided thing.
 * @param thingId id of thing that should handler the thing.
 * @param action action to be handled.
 */
export const processAction = (thingId, action) => {
  return (dispatch, getState) => {
    const thingInstance = createThingInstance(thingId, getState, dispatch);
    thingInstance.processAction(action);
  };
};

const createThingInstance = (id, getState, dispatch) => {
  const getThingState = () => getState().things[id];
  const thingState = getThingState();
  const ThingClass = thingTypes.get(thingState.type);
  return new ThingClass(id, getThingState, dispatch);
};

/**
 * Return active idle thing (no sessions) which is expired with respect to its configuration.
 * @param things state of things.
 * @returns {string|null}
 */
const findExpiredThing = things => {
  const now = Date.now();
  const expiredThingId = Object.keys(things).find(thingId => {
    const thingLifecycle = things[thingId].lifecycle;
    const isIdle = thingLifecycle.state === ThingState.ACTIVE && thingLifecycle.sessionCount === 0;
    const idleTimeoutInSeconds = things[thingId].config.idleTimeout || 0;
    return isIdle && now - thingLifecycle.lastDetachAt > idleTimeoutInSeconds * 1000;
  });
  return expiredThingId || null;
};

const deactivateThing = (id, getState, dispatch) => {
  const thing = createThingInstance(id, getState, dispatch);
  const dispatchedAction = dispatch({
    type: actionTypes.DEACTIVATE_THING,
    payload: { thingId: id },
  });
  if (dispatchedAction.result && dispatchedAction.result.deactivationRequired) {
    thing.deactivate();
  }
  dispatch({ type: actionTypes.THING_DEACTIVATED, payload: { thingId: id } });
};
