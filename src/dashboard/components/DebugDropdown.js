import React from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
  CLink,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";

const DebugDropdown = () => {
  const history = useHistory();
  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon size="2xl" name="header-debug-icon" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Debug</strong>
        </CDropdownItem>
        <CDropdownItem
          onClick={() => {
            history.push("/debug/config");
          }}
        >
          <CIcon name="debug-config-icon" className="mfe-2" />
          Config
        </CDropdownItem>
        <CDropdownItem
          onClick={() => {
            history.push("/debug/mqtt");
          }}
        >
          <CIcon name="debug-mqtt-icon" className="mfe-2" />
          MQTT
        </CDropdownItem>
        <CDropdownItem
          onClick={() => {
            history.push("/debug/things");
          }}
        >
          <CIcon name="debug-things-icon" className="mfe-2" />
          Things
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default DebugDropdown;
