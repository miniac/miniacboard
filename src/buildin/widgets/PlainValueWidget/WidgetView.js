import React, { Component } from "react";
import PropTypes from "prop-types";

import { CCardBody, CCard, CCardHeader, CCardFooter } from "@coreui/react";

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  footerText: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  variant: PropTypes.string,
};

const defaultProps = {
  header: "89.9%",
  mainText: "Lorem ipsum...",
  footerText: "Lorem ipsum dolor sit amet enim.",
  // color: '',
  value: "25",
  variant: "",
};

class WidgetView extends Component {
  render() {
    const {
      className,
      cssModule,
      header,
      mainText,
      footerText,
      color,
      value,
      children,
      variant,
      ...attributes
    } = this.props;

    return (
      <CCard>
        <CCardHeader>{header}</CCardHeader>
        <CCardBody>{children}</CCardBody>
        <CCardFooter>
          <small className="text-muted">{footerText}</small>
        </CCardFooter>
      </CCard>
    );
  }
}

WidgetView.propTypes = propTypes;
WidgetView.defaultProps = defaultProps;

export default WidgetView;
