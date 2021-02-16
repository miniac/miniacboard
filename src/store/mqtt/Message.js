import { parseTopic, matchTopic } from "./topicUtils";

/**
 * Received message.
 */
export class Message {
  /**
   * Wrapped mqtt message.
   */
  #message;

  /**
   * Parsed topic with supplementary data for fast topic matching.
   */
  #parsedTopic;

  /**
   * Constructs received mqtt message.
   * @param message - raw received mqtt message.
   */
  constructor(message) {
    this.#message = message;
    this.#parsedTopic = parseTopic(message.topic);
  }

  /**
   * Returns whether topic of message matches topic filter in subscription.
   * @param {{filter: *, id: string}} subscription - specification of a subscription.
   * @return {boolean} true, if topic of message matches subscription, false otherwise.
   */
  matchSubscription(subscription) {
    return matchTopic(this.#parsedTopic, subscription.filter);
  }

  /**
   * Returns message payload as a string.
   * @return {string} payload as a string.
   */
  get payload() {
    return this.#message.payloadString;
  }

  /**
   * Returns message payload as bytes.
   * @return {ArrayBuffer} payload as array of bytes.
   */
  get payloadBytes() {
    return this.#message.payloadBytes;
  }
}

export default Message;
