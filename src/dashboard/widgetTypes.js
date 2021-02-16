import withThingsConnector from "./withThingsConnector";
const widgetTypesMap = new Map();

export const registerWidgetTypes = widgetTypes => {
  for (const [typeName, widgetComponent] of Object.entries(widgetTypes)) {
    widgetTypesMap.set(typeName, withThingsConnector(widgetComponent));
  }
};

export default widgetTypesMap;
