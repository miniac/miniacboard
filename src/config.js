/**
 * Global configuration of the app.
 */
let config = {};

export const setConfig = configuration => {
  config = configuration;
};

export const getConfig = () => config;
