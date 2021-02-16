import React from "react";
import { CCard, CCardBody, CCardHeader, CButton } from "@coreui/react";

const ButtonWidget = props => {
  return (
    <CCard>
      <CCardHeader>{props.label}</CCardHeader>
      <CCardBody>
        <CButton>Run</CButton>
        <CButton
          active
          block
          color="primary"
          aria-pressed="true"
          onClick={() => props.things.trigger.fireAction()}
        >
          Run
        </CButton>
      </CCardBody>
    </CCard>
  );
};

export default ButtonWidget;
