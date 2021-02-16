import thunk from "redux-thunk";
import { getDefaultMiddleware, configureStore, combineReducers } from "@reduxjs/toolkit";

import mqtt from "./mqtt/reducer";
import things from "./things/reducer";
import dashboard from "./dashboard/reducer";

const rootReducer = combineReducers({ mqtt, things, dashboard });

const store = configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware(), thunk],
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
