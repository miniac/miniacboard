import React from "react";
import { connect } from "react-redux";
import { attachThing, detachThing, processAction } from "../store/things/actions";

export function withThingsConnector(WrappedComponent) {
  const mapStateToProps = (state, ownProps) => {
    if (!ownProps.things) {
      return { things: {} };
    }

    const thingsWithState = {};
    for (const thingName in ownProps.things) {
      const thingId = ownProps.things[thingName];
      const thingState = state.things[thingId].state;
      thingsWithState[thingName] = {
        id: thingId,
        state: thingState,
      };
    }

    return {
      things: thingsWithState,
    };
  };

  const thingsConnector = class ThingsConnector extends React.Component {
    static defaultProps = {
      things: {},
    };

    componentDidMount() {
      for (const thingName in this.props.things) {
        this.props.dispatch(attachThing(this.props.things[thingName].id));
      }
    }

    componentWillUnmount() {
      for (const thingName in this.props.things) {
        this.props.dispatch(detachThing(this.props.things[thingName].id));
      }
    }

    render() {
      const { things, dispatch, ...widgetProps } = this.props;

      const enhancedThings = {};
      for (const thingName in things) {
        const thing = things[thingName];
        enhancedThings[thingName] = {
          ...thing,
          fireAction: action => dispatch(processAction(thing.id, action)),
        };
      }

      return <WrappedComponent things={enhancedThings} {...widgetProps} />;
    }
  };

  return connect(mapStateToProps)(thingsConnector);
}

export default withThingsConnector;
