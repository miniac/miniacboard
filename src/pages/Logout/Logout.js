import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import { disconnect as dashboardDisconnect } from "../../store/dashboard/actions";

class Logout extends Component {
  componentWillMount() {
    this.props.dispatch(dashboardDisconnect());
  }

  render() {
    return <Redirect to="/" />;
  }
}

export default connect()(Logout);
