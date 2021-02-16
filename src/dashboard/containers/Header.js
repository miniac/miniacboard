import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { CHeader, CToggler, CHeaderBrand, CHeaderNav, CSubheader } from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { changeSidebarShow } from "../../store/dashboard/actions";
import SessionDropdown from "../components/SessionDropdown";
import DebugDropdown from "../components/DebugDropdown";
import { getConfig } from "../../config";

export const Header = props => {
  const sidebarShow = useSelector(state => state.dashboard.sidebar.show);
  const showDebugMenu = useSelector(state => state.dashboard.header.showDebugMenu);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    const val = [true, "responsive"].includes(sidebarShow) ? false : "responsive";
    dispatch(changeSidebarShow(val));
  };

  const toggleSidebarMobile = () => {
    const val = [false, "responsive"].includes(sidebarShow) ? true : "responsive";
    dispatch(changeSidebarShow(val));
  };

  return (
    <CHeader>
      <CToggler inHeader className="ml-md-3 d-lg-none" onClick={toggleSidebarMobile} />
      <CToggler inHeader className="ml-3 d-md-down-none" onClick={toggleSidebar} />

      <CHeaderNav className="mr-auto">
        <div className="dashboard-title">{props.title}</div>
      </CHeaderNav>

      <CHeaderNav className="px-3">
        {showDebugMenu && <DebugDropdown />}
        <SessionDropdown />
      </CHeaderNav>
    </CHeader>
  );
};

export default Header;
