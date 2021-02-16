const CHAIN_CONVERTER = "CHAIN";
const INT_CONVERTER = "INT";
const FLOAT_CONVERTER = "FLOAT";
const STRING_CONVERTER = "STRING";
const JSON_CONVERTER = "JSON";

/**
 * Create converter from converter specification.
 * @param {string|string[]} converterSpec
 * @return {Object} converter.
 */
export const createConverter = converterSpec => {
  if (Array.isArray(converterSpec)) {
    return {
      converter: CHAIN_CONVERTER,
      chain: converterSpec.map(spec => createConverter(spec)),
    };
  }

  let converterType;
  let converterDetails = null;
  const sepIdx = converterSpec.indexOf(":");
  if (sepIdx < 0) {
    converterType = converterSpec.toLowerCase().trim();
  } else {
    converterType = converterSpec
      .substr(0, sepIdx)
      .toLowerCase()
      .trim();
    converterDetails = converterSpec.substr(sepIdx + 1).trim();
  }

  if (converterType === "") {
    return {};
  }

  switch (converterType) {
    case "int":
      return { converter: INT_CONVERTER };
    case "float":
      return { converter: FLOAT_CONVERTER };
    case "string":
      return { converter: STRING_CONVERTER };
    case "json":
      return { ...parseJsonConverterSpec(converterDetails), converter: JSON_CONVERTER };
  }

  throw "Unknown converter type";
};

/**
 * Create converter from converter specification.
 * @param {?string|string[]} converterSpec - specification of converter.
 * @return {?Object} converter or null, if converter specification is null.
 */
export const createOptionalConverter = converterSpec => {
  return converterSpec !== null ? createConverter(converterSpec) : null;
};

/**
 * Convert data applying provided converter.
 * @param {Object} converter - the converter.
 * @param {*} data - data to be converter.
 * @return {*} converted value.
 */
export const convert = (converter, data) => {
  if (!converter.hasOwnProperty("converter")) {
    return data;
  }

  try {
    switch (converter.converter) {
      case CHAIN_CONVERTER:
        return convertWithChain(converter, data);
      case INT_CONVERTER:
        return convertToNumber(converter, data);
      case STRING_CONVERTER:
        return convertToString(converter, data);
      case JSON_CONVERTER:
        return convertToJson(converter, data);
    }
  } catch (e) {
    return undefined;
  }

  return undefined;
};

const parseJsonConverterSpec = converterSpec => {
  if (converterSpec === null || converterSpec === "") {
    return { selector: null };
  }

  const path = converterSpec.split(".").map(item => item.trim());
  if (path[0] !== "$") {
    throw "Invalid/unsupported selector in json path";
  }

  return { selector: path.slice(1) };
};

const convertToNumber = (converter, data) => {
  if (data === undefined || data === null) {
    return data;
  }

  if (typeof data === "object") {
    data = JSON.stringify(data);
  }

  if (converter.converter === INT_CONVERTER) {
    return parseInt(data);
  }

  if (converter.converter === FLOAT_CONVERTER) {
    return parseFloat(data);
  }

  return undefined;
};

const convertToString = (converter, data) => {
  if (data === undefined || data === null) {
    return data;
  }

  if (typeof data === "object") {
    return JSON.stringify(data);
  }

  return data.toString();
};

const convertToJson = (converter, data) => {
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      data = undefined;
    }
  }

  if (converter.selector === null) {
    return data;
  }

  if (data === null || typeof data !== "object") {
    return undefined;
  }

  converter.selector.forEach(item => {
    data = data[item];
  });
  return data;
};

const convertWithChain = (converter, data) => {
  converter.chain.forEach(subconverter => {
    data = convert(data, subconverter);
  });

  return data;
};
