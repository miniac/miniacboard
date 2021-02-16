import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";
import "./polyfill";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import store from "./store";
import { icons } from "./assets/icons";

import { setConfig } from "./config";
import { createConfig } from "./custom/config";
import registerBuildin from "./buildin/register";
import registerCustom from "./custom/register";

// initial app setup
React.icons = icons;
registerBuildin();
registerCustom();
setConfig(createConfig(window.appConfig || null));

// render app
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
