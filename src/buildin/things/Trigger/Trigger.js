import { publish } from "../../../store/mqtt";
import Thing from "../../../store/things/Thing";

export class Trigger extends Thing {
  processAction(action) {
    this.dispatch(publish(this.config.targetTopic, "MINIAC", 0, false));
  }
}

export default Trigger;
