import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { CContainer, CFade } from "@coreui/react";

// routes config
// import routes from '../routes'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

const Content = props => {
  return (
    <main className="c-main">
      <CContainer fluid>{props.children}</CContainer>
    </main>
  );
};

export default React.memo(Content);
