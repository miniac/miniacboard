const thingTypesMap = new Map();

export const registerThingTypes = thingTypes => {
  Object.entries(thingTypes).forEach(([typeName, typeClass]) => {
    thingTypesMap.set(typeName, typeClass);
  });
};

export default thingTypesMap;
