import { subscribe, unsubscribe } from "../../../store/mqtt";
import Thing from "../../../store/things/Thing";
import { createConverter, createOptionalConverter, convert } from "../../../utils/converters";

const ACTIVATED = "ACTIVATED";
const DEACTIVATED = "DEACTIVATED";
const MESSAGE_RECEIVED = "MESSAGE_RECEIVED";

/**
 * Thing with state determined by the last message received in associated topic.
 */
export class TopicValue extends Thing {
  static createEffectiveConfig(config) {
    return {
      topic: config.topic || null,
      payloadConverter: config.payloadConverter || "",
      valueConverter: config.valueConverter || "",
      updatedAtConverter: config.updatedAtConverter || null,
    };
  }

  static createInitialState(config) {
    return {
      value: undefined,
      updatedAt: undefined,
      sourceSubscription: null,
      payloadConverter: createConverter(config.payloadConverter),
      valueConverter: createConverter(config.valueConverter),
      updatedAtConverter: createOptionalConverter(config.updatedAtConverter),
    };
  }

  activate() {
    const sourceSubscription = this.dispatch(subscribe(this.config.topic));
    this.localDispatch({ type: ACTIVATED, payload: { sourceSubscription } });
  }

  deactivate() {
    this.dispatch(unsubscribe(this.state.sourceSubscription));
    this.localDispatch({ type: DEACTIVATED });
  }

  processMessage(message) {
    if (message.matchSubscription(this.state.sourceSubscription)) {
      this.localDispatch({
        type: MESSAGE_RECEIVED,
        payload: { data: message.payload, receivedAt: Date.now() },
      });
    }
  }

  reduce(action) {
    switch (action.type) {
      case ACTIVATED:
        return {
          ...this.state,
          sourceSubscription: action.payload.sourceSubscription,
          value: null,
          updatedAt: null,
        };
      case MESSAGE_RECEIVED:
        return { ...this.state, ...this._getStateFromMessage(action.payload) };
      case DEACTIVATED:
        return { ...this.state, sourceSubscription: null, value: undefined, updatedAt: null };
      default:
        return this.state;
    }
  }

  _getStateFromMessage({ data, receivedAt }) {
    data = convert(this.state.payloadConverter, data);
    const value = convert(this.state.valueConverter, data);
    const updatedAt =
      this.state.updatedAtConverter !== null
        ? convert(this.state.updatedAtConverter, data)
        : receivedAt;

    return {
      value,
      updatedAt,
    };
  }

  exposeState() {
    return {
      value: this.state.value,
      updatedAt: this.state.updatedAt,
    };
  }
}

export default TopicValue;
