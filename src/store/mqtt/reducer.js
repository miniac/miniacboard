import * as actionTypes from "./actionTypes";
import { MqttState } from "./constants";

/**
 * Initial state of mqtt sub-store.
 */
const INITIAL_STATE = {
  state: MqttState.DISCONNECTED,
  host: null,
  username: null,
  errorCode: null,
  errorMessage: null,
  subscriptions: {},
  config: {
    maxPublishedMessages: 5,
    maxArrivedMessages: 5,
  },
  history: {
    publishedMessages: [],
    arrivedMessages: [],
  },
};

/**
 * Handles change of state of the current mqtt session.
 * @param {Object} state
 * @param {string} newMqttState
 * @param {Object} stateChanges
 * @return {Object} updated state of mqtt substore.
 */
const handleStateChanged = (state, newMqttState, stateChanges = {}) => {
  return {
    ...state,
    errorCode: null,
    errorMessage: null,
    ...stateChanges,
    state: newMqttState,
  };
};

const handleDisconnected = (state, stateChanges) => {
  return {
    ...state,
    errorCode: null,
    errorMessage: null,
    ...stateChanges,
    state: MqttState.DISCONNECTED,
    subscriptions: {},
    history: INITIAL_STATE.history,
  };
};

const handleSubscriptionChanged = (state, subscriptions) => {
  return {
    ...state,
    subscriptions,
  };
};

const handleMessagePublished = (state, message) => {
  const historySize = state.config.maxPublishedMessages;
  if (historySize === 0) {
    return state;
  }

  let messages = state.history.publishedMessages;
  messages = messages.length === historySize ? messages.slice(0, -1) : messages;
  return {
    ...state,
    history: {
      ...state.history,
      publishedMessages: [message, ...messages],
    },
  };
};

const handleMessageArrived = (state, message) => {
  const historySize = state.config.maxArrivedMessages;
  if (historySize === 0) {
    return state;
  }

  let messages = state.history.arrivedMessages;
  messages = messages.length === historySize ? messages.slice(0, -1) : messages;
  return {
    ...state,
    history: {
      ...state.history,
      arrivedMessages: [message, ...messages],
    },
  };
};

const handleConfigChanged = (state, configChanges) => {
  const config = { ...state.config, ...configChanges };
  const history = {
    ...state.history,
    arrivedMessages: state.arrivedMessages.slice(0, config.maxArrivedMessages),
    publishedMessages: state.published_messages.slice(0, config.maxPublishedMessages),
  };

  return {
    ...state,
    config,
    history,
  };
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.CONNECT:
      return handleStateChanged(state, MqttState.CONNECTING, action.payload);
    case actionTypes.CONNECTED:
      return handleStateChanged(state, MqttState.CONNECTED);
    case actionTypes.RECONNECTING:
      return handleStateChanged(state, MqttState.RECONNECTING, action.payload);
    case actionTypes.RECONNECTED:
      return handleStateChanged(state, MqttState.CONNECTED);
    case actionTypes.DISCONNECT:
      return handleDisconnected(state, action.payload);
    case actionTypes.SUBSCRIBE:
      return handleSubscriptionChanged(state, action.payload.subscriptions);
    case actionTypes.UNSUBSCRIBE:
      return handleSubscriptionChanged(state, action.payload.subscriptions);
    case actionTypes.MESSAGE_PUBLISHED:
      return handleMessagePublished(state, action.payload);
    case actionTypes.MESSAGE_ARRIVED:
      return handleMessageArrived(state, action.payload);
    case actionTypes.CONFIG_CHANGED:
      return handleConfigChanged(state, action.payload);
    default:
      return state;
  }
};

export default reducer;
