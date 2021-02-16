import React from "react";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { CCol, CRow } from "@coreui/react";

import widgetTypes from "../../dashboard/widgetTypes";
import Dashboard from "../../dashboard/Dashboard";

const WidgetGrid = ({ gridSpec }) => {
  return renderWidgetGrid(gridSpec);
};

const renderWidgetGrid = widgetGrid => {
  return <>{widgetGrid.rows.map(row => renderRowOfGrid(row))}</>;
};

const renderRowOfGrid = row => {
  return <CRow>{row.widgets.map(widget => renderWidgetInGrid(widget))}</CRow>;
};

const renderWidgetInGrid = widget => {
  return <CCol {...widget.col}>{renderWidget(widget)}</CCol>;
};

const renderWidget = widget => {
  if (!widgetTypes.has(widget.type)) {
    throw Error("Unknown widget type.");
  }

  return React.createElement(widgetTypes.get(widget.type), widget.properties || {});
};

const View = props => {
  const views = useSelector(state => state.dashboard.views);
  const { location } = props;

  const selectedViewId = location.pathname.substr(1);
  if (!views.hasOwnProperty(selectedViewId)) {
    return (
      <Dashboard>
        <div>Unknown view</div>
      </Dashboard>
    );
  }

  const view = views[selectedViewId];
  return (
    <Dashboard title={view.title}>
      <WidgetGrid gridSpec={view.widgetGrid} />
    </Dashboard>
  );
};

export default withRouter(View);
