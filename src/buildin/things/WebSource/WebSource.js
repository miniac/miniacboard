import Thing from "../../../store/things/Thing";
import axios from "axios";

const REQUEST_STARTED = "REQUEST_STARTED";
const REQUEST_DONE = "REQUEST_DONE";
const REQUEST_FAILED = "REQUEST_FAILED";
const DEACTIVATED = "DEACTIVATED";

export class WebSource extends Thing {
  static createInitialState(config) {
    return {
      content: null,
      changedAt: null,
      loading: false,
    };
  }

  async fetchContent() {
    try {
      this.localDispatch({
        type: REQUEST_STARTED,
      });
      const response = await axios.get(`http://jsonplaceholder.typicode.com/users`);
      this.localDispatch({
        type: REQUEST_DONE,
        payload: {
          content: response.data,
          changedAt: Date.now(),
        },
      });
    } catch (e) {
      this.localDispatch({
        type: REQUEST_FAILED,
        payload: e.message,
      });
    }
  }

  activate() {
    this.dispatch(async dispatch => {
      await this.fetchContent();
    });
  }

  deactivate() {
    this.localDispatch({ type: DEACTIVATED });
  }

  reduce(action) {
    switch (action.type) {
      case REQUEST_STARTED:
        return { ...this.state, content: null, changedAt: null };
      case REQUEST_DONE:
        return {
          ...this.state,
          content: action.payload.content,
          changedAt: action.payload.changedAt,
        };
      case REQUEST_FAILED:
        return { ...this.state, content: null, changedAt: null };
      case DEACTIVATED:
        return { ...this.state, content: null, changedAt: null };
      default:
        return this.state;
    }
  }

  exposeState() {
    return {
      content: this.state.content,
      changedAt: this.state.changedAt,
    };
  }
}

export default WebSource;
