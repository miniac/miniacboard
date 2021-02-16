// Configure application
window.appConfig = {
  settings: {
    defaultRoute: "sensorsPage",
  },
  mqtt: {
    port: 8000,
    useSSL: false,
    host: "broker.mqttdashboard.com",
    username: "",
    password: "",
  },
  things: {
    Sensor1: {
      type: "TopicValue",
      idleTimeout: 10,
      properties: {
        topic: "miniac/sensor/1",
      },
    },
    Sensor2: {
      type: "TopicValue",
      idleTimeout: 10,
      properties: {
        topic: "miniac/sensor/2",
      },
    },
  },
  views: {
    sensorsPage: {
      title: "Sensors",
      widgetGrid: {
        rows: [
          {
            widgets: [
              {
                type: "PlainValueWidget",
                col: {
                  xs: 6,
                  sm: 6,
                  lg: 3,
                },
                properties: {
                  things: { source: "Sensor1" },
                  title: "Sensor 1",
                  unit: "\u00B0C",
                },
              },
              {
                type: "PlainValueWidget",
                col: {
                  xs: 6,
                  sm: 6,
                  lg: 3,
                },
                properties: {
                  things: { source: "Sensor2" },
                  title: "Sensor 2",
                  unit: "\u00B0C",
                },
              },
            ],
          },
        ],
      },
    },
    dashboardPage: {
      title: "Dashboard",
      widgetGrid: {
        rows: [
          {
            widgets: [],
          },
        ],
      },
    },
  },
  loginPage: {
    isHostShown: true,
    isUserShown: true,
    isPasswordShown: true,
  },
  dashboard: {
    header: {
      showDebugMenu: true,
      items: [],
    },
    sidebar: {
      heading: {},
      items: [
        {
          label: "Sensors",
          route: "/sensorsPage",
          icon: {
            asset: "miniac.png",
          },
        },
        {
          label: "Dashboard",
          route: "/dashboardPage",
          icon: {
            asset: "tank.svg#mshape",
            svgViewBox: "0 0 24 24",
          },
        },
      ],
    },
  },
};
