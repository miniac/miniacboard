# MiniacBoard

MiniacBoard is a configurable MQTT dashboard (not only) for Internet of Things.

Features:
- standalone react application (no server required to run)
- model (thing) - view (widget) pattern
- websocket connection to MQTT broker
- configurable and customizable (custom things and components, static configuration file)

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Configuration

Configuration file of dashboard application is `public/configuration.js`. 
All assets should be placed in the directory `public/assets`. 
Changes in configuration and/or asset directory do not require a rebuild of application.

Main concepts:
- `thing` is a source of data and/or action receiver (usually associated with MQTT topics)
- `widget` is a visual representation of one or more things
- `view` is a routable collection of widgets
