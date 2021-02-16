import { registerThingTypes } from "../store/things/thingTypes";
import { registerWidgetTypes } from "../dashboard/widgetTypes";

export const register = () => {
  registerThingTypes({});
  registerWidgetTypes({});
};

export default register;
