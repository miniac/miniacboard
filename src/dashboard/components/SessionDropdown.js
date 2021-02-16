import React from "react";
import { CBadge, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { SessionState } from "../../store/dashboard/contants";

import {
  IoCloudDoneOutline as SessionOnIcon,
  IoCloudOfflineOutline as SessionOffIcon,
} from "react-icons/io5";

const SessionDropdown = () => {
  const history = useHistory();
  const session = useSelector(state => state.dashboard.session);

  const connectionIcon =
    session.state === SessionState.CONNECTED ? (
      <SessionOnIcon size={32}/>
    ) : (
      <SessionOffIcon size={32}/>
    );

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        {connectionIcon}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem header tag="div" color="light" className="text-center">
          <strong>Connection</strong>
        </CDropdownItem>
        <CDropdownItem
          onClick={() => {
            history.push("/logout");
          }}
        >
          <CIcon name="account-logout-icon" className="mfe-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default SessionDropdown;
