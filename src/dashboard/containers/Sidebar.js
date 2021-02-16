import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarMinimizer,
  CSidebarNavItem,
} from "@coreui/react";

import miniac from "../../assets/img/miniac.svg";

import { changeSidebarShow } from "../../store/dashboard/actions";
import { getAssetPath } from "../../utils/assets";

const parseIcon = iconSpec => {
  const assetPath = getAssetPath(iconSpec.asset);
  if (assetPath.indexOf(".svg#") >= 0) {
    return {
      use: assetPath,
      viewBox: iconSpec.svgViewBox || "0 0 32 32",
    };
  }

  return {
    src: assetPath,
    className: "c-sidebar-nav-icon",
  };
};

const createItemComponent = spec => {
  const { label, route, icon } = spec;
  const iconProps = icon ? parseIcon(icon) : "sidebarDefaultIcon";
  return <CSidebarNavItem name={label} to={route} icon={iconProps} />;
};

export const Sidebar = () => {
  const itemSpecs = useSelector(state => state.dashboard.sidebar.items);
  const sidebarShow = useSelector(state => state.dashboard.sidebar.show);
  const dispatch = useDispatch();

  const itemComponents = itemSpecs.map(itemSpec => createItemComponent(itemSpec));

  return (
    <CSidebar show={sidebarShow} onShowChange={val => dispatch(changeSidebarShow(val))}>
      <CSidebarBrand className="d-md-down-none" to="/">
        <div className="c-sidebar-brand-full">
          <img src={miniac} height={35} />
          <span className="app-name">MiniacBoard</span>
        </div>
        <img src={miniac} className="c-sidebar-brand-minimized" height={35} />
      </CSidebarBrand>
      <CSidebarNav>{itemComponents}</CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default Sidebar;
