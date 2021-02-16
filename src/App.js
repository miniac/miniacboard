import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Link,
  Redirect,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/Login/Login";
import { SessionState } from "./store/dashboard/contants";
import View from "./pages/View/View";
import Logout from "./pages/Logout/Logout";
import "./scss/style.scss";
import MqttDebugPage from "./pages/MqttDebug/MqttDebug";
import ThingsDebugPage from "./pages/ThingsDebug/ThingsDebug";
import Session from "./dashboard/Session";
import ConfigPage from "./pages/Config/Config";
import { getConfig } from "./config";

const WithSession = withRouter(props => {
  const sessionState = useSelector(state => state.dashboard.session.state);
  return sessionState === SessionState.CONNECTED ? (
    <Session>{props.children}</Session>
  ) : (
    <Redirect
      to={{
        pathname: props.loginPage,
        state: { from: props.location },
      }}
    />
  );
});

function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route>
          <WithSession loginPage="/login">
            <Switch>
              <Route path="/" exact={true}>
                <Redirect to={getConfig().settings.defaultRoute} />
              </Route>
              <Route path="/logout">
                <Logout />
              </Route>
              <Route path="/debug/mqtt">
                <MqttDebugPage />
              </Route>
              <Route path="/debug/things">
                <ThingsDebugPage />
              </Route>
              <Route path="/debug/config">
                <ConfigPage />
              </Route>
              <Route>
                <View />
              </Route>
            </Switch>
          </WithSession>
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
