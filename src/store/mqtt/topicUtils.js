/**
 * Type of a parsed topic filter.
 */
const FilterType = {
  /**
   * Simple filter without wildcards.
   */
  SIMPLE: "SIMPLE",

  /**
   * Simple filter with multi-level wildcard at the end.
   */
  SIMPLE_WITH_MULTI_LEVEL: "SIMPLE_WITH_MULTI_LEVEL",

  /**
   * Filter containing only single level wildcards.
   */
  SINGLE_LEVELS_ONLY: "SINGLE_LEVELS_ONLY",

  /**
   * Filter containing single level wildcards and multi-level wildcard at the end.
   */
  SINGLE_LEVELS_WITH_MULTI_LEVEL: "SINGLE_LEVELS_WITH_MULTI_LEVEL",
};

/**
 * Returns parsed topic filter with supplementary data for fast topic matching.
 * @param {string} topicFilter - a specification of topics.
 * @return {Object.<string, *>} - parsed specification of topic filter.
 */
export const parseTopicFilter = topicFilter => {
  const filterSegments = topicFilter.split("/");

  const hasSingleLevelWildCard = filterSegments.includes("+");
  const multiLevelWildCardIdx = filterSegments.indexOf("#");
  if (multiLevelWildCardIdx >= 0 && multiLevelWildCardIdx !== filterSegments.length - 1) {
    throw new Error("Invalid topic filter.");
  }

  if (!hasSingleLevelWildCard) {
    if (multiLevelWildCardIdx === -1) {
      return {
        type: FilterType.SIMPLE,
        raw: topicFilter,
      };
    }

    return {
      type: FilterType.SIMPLE_WITH_MULTI_LEVEL,
      raw: topicFilter,
      parsed: topicFilter.slice(0, -1),
    };
  }

  if (multiLevelWildCardIdx === -1) {
    return {
      type: FilterType.SINGLE_LEVELS_ONLY,
      raw: topicFilter,
      parsed: filterSegments,
    };
  }

  return {
    type: FilterType.SINGLE_LEVELS_WITH_MULTI_LEVEL,
    raw: topicFilter,
    parsed: filterSegments.slice(0, -1),
  };
};

/**
 * Returns raw topic filter from a parsed topic filter.
 *
 * @param {Object.<string, *>} parsedTopicFilter - a parsed topic filter.
 * @return {string} - raw topic filter.
 */
export const getTopicFilter = parsedTopicFilter => parsedTopicFilter.raw;

/**
 * Returns parsed topic with supplementary data for fast topic matching.
 * @param {string} topic - a topic to be parsed.
 * @return {Object.<string, *>} a parsed topic.
 */
export const parseTopic = topic => ({
  topic,
  segments: topic.split("/"),
});

/**
 * Returns whether provided parsed topic matched provided parsed topic filter.
 * @param {Object.<string, *>} parsedTopic - a parsed topic.
 * @param {Object.<string, *>} parsedTopicFilter - a parsed topic filter.
 * @return {boolean} true, if topic matches topic filter, false otherwise.
 */
export const matchTopic = (parsedTopic, parsedTopicFilter) => {
  if (parsedTopicFilter.type === FilterType.SIMPLE) {
    return parsedTopic.topic === parsedTopicFilter.raw;
  }

  if (parsedTopicFilter.type === FilterType.SIMPLE_WITH_MULTI_LEVEL) {
    return parsedTopic.topic.startsWith(parsedTopicFilter.parsed);
  }

  const topicFilterSegments = parsedTopicFilter.parsed;
  const topicSegments = parsedTopic.segments;

  if (
    parsedTopicFilter.type === FilterType.SINGLE_LEVELS_ONLY &&
    topicFilterSegments.length !== topicSegments.length
  )
    return false;

  if (
    parsedTopicFilter.type === FilterType.SINGLE_LEVELS_WITH_MULTI_LEVEL &&
    topicFilterSegments.length >= topicSegments.length
  )
    return false;

  for (let i = 0; i < topicSegments.length; i += 1) {
    if (topicFilterSegments[i] !== "+" && topicFilterSegments[i] !== topicSegments[i]) {
      return false;
    }
  }

  return true;
};
