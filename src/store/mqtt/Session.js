import { Client } from "paho-mqtt";
import { MqttState } from "./constants";
import { Message as MqttMessage } from "./Message";
import * as actionTypes from "./actionTypes";
import { parseTopicFilter, getTopicFilter } from "./topicUtils";

/**
 * Subscription counter used to generate unique subscription identifiers.
 * @type {number}
 */
let subscriptionSequenceCounter = 1;

/**
 * Generates new unique subscription id.
 * @returns {string} newly generated subscription id.
 */
const getNextSubscriptionId = () => {
  const subscriptionId = `@${subscriptionSequenceCounter.toString(16)}`;
  subscriptionSequenceCounter += 1;
  return subscriptionId;
};

/**
 * MQTT session.
 */
export class Session {
  /**
   * Indicate whether session is active, i.e., it was not closed explicitly.
   * @type {boolean}
   */
  isActive = true;

  /**
   * State of session.
   * @type {string}
   */
  state = MqttState.DISCONNECTED;

  /**
   * Active subscriptions.
   * @type {Object.<string, {filter: *, id: string}>}
   * @readonly
   */
  subscriptions = Object.create(null);

  /**
   * Number of active subscriptions per topic filter.
   * @type {Map<string, number>}
   * @readonly
   */
  filterUsageCounts = new Map();

  /**
   * Construct and open MQTT session.
   * @param {ClientSettings} settings - configuration of MQTT client to be used.
   * @param {Function} dispatch - dispatch of associated redux store.
   */
  constructor(settings, dispatch) {
    this.settings = settings.createSettings();
    this.client = new Client(settings.host, settings.port, settings.path, settings.clientId);
    this.dispatch = dispatch;

    this.client.onMessageArrived = message => {
      if (this.isActive) {
        const receivedMessage = new MqttMessage(message);
        dispatch({
          type: actionTypes.MESSAGE_ARRIVED,
          payload: { timestamp: Date.now(), topic: message.topic, payload: message.payloadString },
        });
        settings.onMessageReceived.forEach(handler => handler(receivedMessage));
      }
    };

    this.client.onConnectionLost = ({ errorCode, errorMessage }) => {
      if (this.isActive) {
        dispatch({
          type: actionTypes.RECONNECTING,
          payload: {
            errorCode,
            errorMessage,
          },
        });
        this.changeState(MqttState.RECONNECTING, errorMessage);
      }
    };

    this.client.onConnected = reconnect => {
      if (!this.isActive) {
        return;
      }

      if (reconnect) {
        dispatch({ type: actionTypes.RECONNECTED });
        this.changeState(MqttState.CONNECTED);
      }
    };

    const connectionOptions = {
      useSSL: settings.useSSL,
      userName: settings.username,
      password: settings.password,
      onSuccess: () => {
        if (this.isActive) {
          dispatch({ type: actionTypes.CONNECTED });
          this.changeState(MqttState.CONNECTED);
        }
      },
      onFailure: ({ errorCode, errorMessage }) => {
        if (this.isActive) {
          this.isActive = false;
          dispatch({ type: actionTypes.DISCONNECT, payload: { errorCode, errorMessage } });
          this.changeState(MqttState.DISCONNECTED, errorMessage);
        }
      },
      cleanSession: true,
    };

    setTimeout(() => {
      this.changeState(MqttState.CONNECTING);
      this.client.connect(connectionOptions);
    });

    dispatch({
      type: actionTypes.CONNECT,
      payload: {
        host: this.settings.host,
        username: this.settings.username,
      },
    });
  }

  close() {
    if (!this.isActive) {
      return;
    }
    this.isActive = false;
    this.dispatch({ type: actionTypes.DISCONNECT });
    this.client.disconnect();
    this.changeState(MqttState.DISCONNECTED);
  }

  changeState(newState, reason = null) {
    const previousState = this.state;
    if (previousState === newState) {
      return;
    }

    this.state = newState;
    this.settings.onConnectionChanged.forEach(handler => handler(previousState, newState, reason));

    if (previousState === MqttState.CONNECTING && newState === MqttState.CONNECTED) {
      this.settings.onSessionStarted.forEach(handler => handler());
    }

    if (previousState !== MqttState.CONNECTING && newState === MqttState.DISCONNECTED) {
      this.settings.onSessionClosed.forEach(handler => handler());
    }
  }

  /**
   * Subscribe to specified topics.
   * @param {string} topicFilter - specification of topics to subscribe.
   * @returns {{filter: *, id: string}} Subscription specification as a plain object.
   */
  subscribe(topicFilter) {
    const subscriptionId = getNextSubscriptionId();

    const filterUsageCount = this.filterUsageCounts.get(topicFilter) || 0;
    this.filterUsageCounts.set(topicFilter, filterUsageCount + 1);
    if (filterUsageCount === 0) {
      try {
        this.client.subscribe(topicFilter);
      } catch (e) {
        console.error("Subscribe failed.");
      }
    }

    const subscription = {
      id: subscriptionId,
      filter: parseTopicFilter(topicFilter),
    };

    this.subscriptions[subscriptionId] = subscription;
    this.dispatch({
      type: actionTypes.SUBSCRIBE,
      payload: { subscriptions: { ...this.subscriptions } },
    });
    return subscription;
  }

  /**
   * Deactivate subscription.
   * @param {{filter: *, id: string}} subscription - Subscription specification returned
   * from {@link #subscribe}.
   */
  unsubscribe(subscription) {
    const subscriptionId = subscription.id;

    if (!(subscriptionId in this.subscriptions)) {
      throw new Error("Invalid subscription.");
    }

    const topicFilter = getTopicFilter(this.subscriptions[subscriptionId].filter);
    delete this.subscriptions[subscriptionId];

    this.filterUsageCounts.set(topicFilter, this.filterUsageCounts.get(topicFilter) - 1);
    if (this.filterUsageCounts.get(topicFilter) === 0) {
      this.filterUsageCounts.delete(topicFilter);
      this.client.unsubscribe(topicFilter);
    }

    this.dispatch({
      type: actionTypes.UNSUBSCRIBE,
      payload: { subscriptions: { ...this.subscriptions } },
    });
  }

  /**
   * Publishes a message.
   * @param {string} topic - topic of published message.
   * @param {string} payload - payload of the published message.
   * @param {number} qos - QoS of published message.
   * @param {boolean} retained - flag indicating whether messages is retained.
   */
  publish(topic, payload, qos, retained) {
    if (!this.isActive) {
      return;
    }

    this.client.publish(topic, payload, qos, retained);
    this.dispatch({
      type: actionTypes.MESSAGE_PUBLISHED,
      payload: { timestamp: Date.now(), topic, payload, qos, retained },
    });
  }
}

export default Session;
