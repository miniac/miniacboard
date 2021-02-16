import * as actionTypes from "./actionTypes";
import { SessionState } from "./contants";

const INITIAL_STATE = {
  session: {
    state: SessionState.DISCONNECTED,
    isActive: false,
    host: null,
    username: null,
    reason: null,
  },
  views: {},
  quickLinks: {
    items: [],
  },
  sidebar: {
    show: "responsive",
    items: [],
  },
  header: {
    showDebugMenu: true,
  },
};

const handleConfigApplied = (state, config) => {
  return {
    ...state,
    sidebar: {
      show: "responsive",
      items: config.dashboard.sidebar.items,
    },
    header: {
      showDebugMenu: config.dashboard.header.showDebugMenu,
    },
    views: config.views,
  };
};

export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SESSION_UPDATED:
      return { ...state, session: { ...state.session, ...action.payload } };
    case actionTypes.CONFIG_APPLIED:
      return handleConfigApplied(state, action.payload);
    case actionTypes.SIDEBAR_SHOW_CHANGED:
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          show: action.payload.sidebarShow,
        },
      };
    default:
      return state;
  }
};

export default reducer;
