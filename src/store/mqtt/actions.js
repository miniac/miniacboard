import Session from "./Session";
import * as actionTypes from "./actionTypes";

/**
 * Currently active session or null, if no session has been created.
 * @type {?Session}
 */
let activeSession = null;

/**
 * Disconnects the current session.
 * @return {Function} action for thunk.
 */
export const disconnect = () => () => {
  if (activeSession != null) {
    const session = activeSession;
    activeSession = null;
    session.close();
  }
};

/**
 * Connects to mqtt.
 * @param clientSettings {ClientSettings} configuration of mqtt client.
 * @return {Function} action for thunk.
 */
export const connect = clientSettings => {
  return dispatch => {
    dispatch(disconnect());
    activeSession = new Session(clientSettings, dispatch);
  };
};

/**
 * Subscribes to specified topics.
 * @param topicFilter {string} - a topic filter.
 * @return {Function} action for thunk returning created
 * subscription.
 */
export const subscribe = topicFilter => () => {
  if (activeSession !== null) {
    return activeSession.subscribe(topicFilter);
  }

  return null;
};

/**
 * Unsubscribes an existing subscription.
 * @param {{filter: *, id: string}} subscription - a subscription specification.
 * @return {Function} action for thunk.
 */
export const unsubscribe = subscription => () => {
  if (activeSession !== null) {
    activeSession.unsubscribe(subscription);
  }
};

/**
 * Publishes a message.
 * @param {string} topic - topic of message.
 * @param {string} payload - payload of message.
 * @param {number} qos - quality of service for message publication.
 * @param {boolean} retained - flag indicating whether message is retained.
 * @return {Function} action for thunk.
 */
export const publish = (topic, payload, qos = 0, retained = false) => () => {
  if (activeSession !== null) {
    activeSession.publish(topic, payload, qos, retained);
  }
};

/**
 * Adjust configuration of mqtt session tracking.
 * @param {number} maxArrivedMessages - the maximum number of most recent arrived messages to store.
 * @param {number} maxPublishedMessages - the maximum number of most recent published messages
 * to store.
 * @return {{payload: Object, type: string}} - action for redux.
 */
export const configure = ({ maxArrivedMessages, maxPublishedMessages } = {}) => {
  const configChanges = {};
  if (maxArrivedMessages !== undefined) {
    configChanges.maxArrivedMessages = maxArrivedMessages;
  }

  if (maxPublishedMessages !== undefined) {
    configChanges.maxPublishedMessages = maxPublishedMessages;
  }

  return {
    type: actionTypes.CONFIG_CHANGED,
    payload: configChanges,
  };
};
