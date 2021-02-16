import React from "react";
import Dashboard from "../../dashboard/Dashboard";
import ReactJson from "react-json-view";
import { getConfig } from "../../config";

const Config = props => {
  return (
    <Dashboard title="App config">
      <ReactJson
        src={getConfig()}
        displayObjectSize={false}
        displayDataTypes={false}
        sortKeys={true}
      />
    </Dashboard>
  );
};

export default Config;
