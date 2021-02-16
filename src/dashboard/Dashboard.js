import React from "react";
import Content from "./containers/Content";
import Header from "./containers/Header";
import Sidebar from "./containers/Sidebar";
import Footer from "./containers/Footer";

const Dashboard = props => {
  return (
    <div className="c-app c-default-layout">
      <Sidebar />
      <div className="c-wrapper">
        <Header title={props.title} />
        <div className="c-body">
          <Content>{props.children}</Content>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
