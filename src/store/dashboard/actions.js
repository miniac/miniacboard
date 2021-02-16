import * as mqtt from "../mqtt/actions";
import ClientSettings from "../mqtt/ClientSettings";
import * as actionTypes from "./actionTypes";
import { SessionState } from "./contants";
import {
  createThings,
  deactivateExpiredThings,
  destroyThings,
  processMessage,
} from "../things/actions";

import { MqttState } from "../mqtt/constants";

export const connect = sessionConfig => dispatch => {
  const mqttClientSettings = createMqttClientSettings(sessionConfig);
  mqttClientSettings.onConnectionChanged.push((previousState, newState, reason) =>
    handleMqttStateChanged(dispatch, previousState, newState, reason),
  );
  mqttClientSettings.onMessageReceived.push(message => dispatch(processMessage(message)));

  dispatch(initiateSession(sessionConfig.mqtt.host, sessionConfig.mqtt.username));
  dispatch(createThings(sessionConfig.things));
  dispatch(applyConfig(sessionConfig));
  dispatch(mqtt.connect(mqttClientSettings));
};

export const disconnect = () => dispatch => {
  dispatch(destroyThings());
  dispatch(mqtt.disconnect());
};

const createMqttClientSettings = sessionConfig => {
  const clientSettings = new ClientSettings();
  clientSettings.host = sessionConfig.mqtt.host;
  clientSettings.path = sessionConfig.mqtt.path || "/mqtt";
  clientSettings.useSSL = sessionConfig.mqtt.useSSL || false;
  clientSettings.port = sessionConfig.mqtt.port || 8083;
  clientSettings.username = sessionConfig.mqtt.username || "";
  clientSettings.password = sessionConfig.mqtt.password || "";
  return clientSettings;
};

const initiateSession = (host, username) => ({
  type: actionTypes.SESSION_UPDATED,
  payload: {
    state: SessionState.CONNECTING,
    isActive: false,
    reason: null,
    host,
    username,
  },
});

/**
 * Update dashboard session with respect to new state of mqtt state.
 * @param {string} mqttState - the state of mqtt session.
 * @param {?string} reason - reason of update.
 * @return {{payload: {reason: ?string, state: string, isActive: boolean}, type: string}}
 */
const updateSession = (mqttState, reason) => {
  switch (mqttState) {
    case MqttState.CONNECTING:
      return {
        type: actionTypes.SESSION_UPDATED,
        payload: {
          state: SessionState.CONNECTING,
          isActive: false,
          reason,
        },
      };
    case MqttState.RECONNECTING:
      return {
        type: actionTypes.SESSION_UPDATED,
        payload: {
          state: SessionState.CONNECTED,
          isActive: false,
          reason,
        },
      };
    case MqttState.CONNECTED:
      return {
        type: actionTypes.SESSION_UPDATED,
        payload: {
          state: SessionState.CONNECTED,
          isActive: true,
          reason,
        },
      };
    case MqttState.DISCONNECTED:
      return {
        type: actionTypes.SESSION_UPDATED,
        payload: {
          state: SessionState.DISCONNECTED,
          isActive: false,
          reason,
        },
      };
    default:
      throw new Error("Unknown MQTT state.");
  }
};

/**
 * Handles change of Mqtt session state.
 * @param {Function} dispatch - the redux dispatch function.
 * @param {string} previousState - previous mqtt state.
 * @param {string} newState - new mqtt state.
 * @param {?string} reason - reason why mqtt state was changed.
 */
const handleMqttStateChanged = (dispatch, previousState, newState, reason) => {
  const isInitiatingSession =
    previousState === MqttState.DISCONNECTED && newState === MqttState.CONNECTING;

  if (!isInitiatingSession) {
    dispatch(updateSession(newState, reason));
  }
};

const applyConfig = sessionConfig => ({
  type: actionTypes.CONFIG_APPLIED,
  payload: {
    ...sessionConfig,
  },
});

export const changeSidebarShow = sidebarShow => ({
  type: actionTypes.SIDEBAR_SHOW_CHANGED,
  payload: {
    sidebarShow,
  },
});

export const manageSession = () => dispatch => {
  dispatch(deactivateExpiredThings());
};
