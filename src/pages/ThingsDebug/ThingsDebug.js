import React from "react";
import { CRow, CCol, CCard, CCardHeader, CCardBody, CDataTable } from "@coreui/react";
import { useSelector } from "react-redux";
import { ThingState } from "../../store/things/constants";
import thingTypes from "../../store/things/thingTypes";
import Dashboard from "../../dashboard/Dashboard";

const Things = props => {
  const things = useSelector(state => state.things);
  const tableData = Object.entries(things).map(([id, thing]) => ({
    id: id,
    type: thing.type,
    state: thing.lifecycle.state,
    sessionCount: thing.lifecycle.sessionCount,
    lastDetachAt: new Date(thing.lifecycle.lastDetachAt).toISOString(),
  }));

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Things</CCardHeader>
            <CCardBody>
              <CDataTable
                items={tableData}
                fields={["id", "type", "state", "sessionCount", "lastDetachAt"]}
                striped
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

const ThingsDebug = props => {
  return (
    <Dashboard title="Debug Things">
      <Things />
    </Dashboard>
  );
};

export default ThingsDebug;
