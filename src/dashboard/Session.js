import React from "react";
import { connect } from "react-redux";
import { manageSession} from "../store/dashboard/actions";

class Session extends React.Component {
  componentDidMount() {
    this.timer = setInterval(() => {this.props.dispatch(manageSession())}, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <>{this.props.children}</>;
  }
}

export default connect()(Session);
