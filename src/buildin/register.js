import { registerThingTypes } from "../store/things/thingTypes";
import { registerWidgetTypes } from "../dashboard/widgetTypes";

import TopicValue from "./things/TopicValue/TopicValue";
import Trigger from "./things/Trigger/Trigger";
import WebSource from "./things/WebSource/WebSource";
import PlainValueWidget from "./widgets/PlainValueWidget/PlainValueWidget";
import ButtonWidget from "./widgets/ButtonWidget/ButtonWidget";

export const register = () => {
  registerThingTypes({ TopicValue, Trigger, WebSource });
  registerWidgetTypes({ PlainValueWidget, ButtonWidget });
};

export default register;
