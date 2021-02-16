import * as actionTypes from "./actionTypes";
import { ThingState } from "./constants";
import thingTypes from "./thingTypes";

const createThings = (state, action) => {
  return Object.fromEntries(
    Object.entries(action.payload).map(([thingId, thingConfig]) => {
      const ThingClass = thingTypes.get(thingConfig.type);
      const thing = {
        type: thingConfig.type,
        state: {},
        lifecycle: {
          state: ThingState.INACTIVE,
          sessionCount: 0,
          lastDetachAt: 0,
        },
        config: thingConfig,
        internalState: ThingClass.createInitialState(ThingClass.createEffectiveConfig(thingConfig)),
      };

      return [thingId, thing];
    }),
  );
};

const thingAttached = (state, action) => {
  const { thingId } = action.payload;
  const thingState = state[thingId];

  const { lifecycle } = thingState;
  const activationRequired =
    lifecycle.sessionCount === 0 && lifecycle.state === ThingState.INACTIVE;

  action.result = { activationRequired };

  return {
    ...state,
    [thingId]: {
      ...thingState,
      lifecycle: {
        ...thingState.lifecycle,
        state: activationRequired ? ThingState.ACTIVATING : lifecycle.state,
        sessionCount: thingState.lifecycle.sessionCount + 1,
      },
    },
  };
};

const thingActivated = (state, action) => {
  const { thingId } = action.payload;
  const thingState = state[thingId];
  return {
    ...state,
    [thingId]: {
      ...thingState,
      lifecycle: {
        ...thingState.lifecycle,
        state: ThingState.ACTIVE,
      },
    },
  };
};

const thingDetached = (state, action) => {
  const { thingId, timestamp } = action.payload;
  const thingState = state[thingId];

  if (thingState.lifecycle.sessionCount <= 0) {
    console.error(`Thing ${thingId} detached more times than attached.`);
    return state;
  }

  return {
    ...state,
    [thingId]: {
      ...thingState,
      lifecycle: {
        ...thingState.lifecycle,
        sessionCount: thingState.lifecycle.sessionCount - 1,
        lastDetachAt: timestamp,
      },
    },
  };
};

const deactivateThing = (state, action) => {
  const { thingId } = action.payload;
  const thingState = state[thingId];
  const { lifecycle } = thingState;

  const deactivationRequired = lifecycle.state !== ThingState.INACTIVE;
  action.result = { deactivationRequired };

  return {
    ...state,
    [thingId]: {
      ...thingState,
      lifecycle: {
        ...lifecycle,
        state: ThingState.DEACTIVATING,
      },
    },
  };
};

const thingDeactivated = (state, action) => {
  const { thingId } = action.payload;
  const thingState = state[thingId];
  const { lifecycle } = thingState;
  return {
    ...state,
    [thingId]: {
      ...thingState,
      lifecycle: {
        ...lifecycle,
        state: ThingState.INACTIVE,
      },
    },
  };
};

const handleThingAction = (state, action) => {
  const { thingId, type, payload } = action.payload;
  const thingState = state[thingId];
  const ThingClass = thingTypes.get(thingState.type);
  const thingInstance = new ThingClass(thingId, () => thingState);
  const reducedThingState = thingInstance.reduceAndExpose({ type, payload });
  if (reducedThingState === thingState) {
    return state;
  }

  return {
    ...state,
    [thingId]: reducedThingState,
  };
};

/**
 * Handle things related actions.
 * @param state - The state.
 * @param action - The action to be reduced.
 * @returns Reduced state of things.
 */
export const reducer = (state = {}, action) => {
  switch (action.type) {
    case actionTypes.CREATE_THINGS:
      return createThings(state, action);
    case actionTypes.THING_ATTACHED:
      return thingAttached(state, action);
    case actionTypes.THING_ACTIVATED:
      return thingActivated(state, action);
    case actionTypes.HANDLE_THING_ACTION:
      return handleThingAction(state, action);
    case actionTypes.THING_DETACHED:
      return thingDetached(state, action);
    case actionTypes.DEACTIVATE_THING:
      return deactivateThing(state, action);
    case actionTypes.THING_DEACTIVATED:
      return thingDeactivated(state, action);
    default:
      return state;
  }
};

export default reducer;
