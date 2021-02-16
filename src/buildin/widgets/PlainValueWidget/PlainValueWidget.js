import React, { useState } from "react";
import WidgetView from "./WidgetView";
import { createConverter, convert } from "../../../utils/converters";

const PlainValueWidget = props => {
  const [converters] = useState(() => {
    return {
      value: createConverter(props.valueConverter || "json:$.source.state.value"),
      updatedAt: createConverter(props.updatedAtConverter || "json:$.source.state.updatedAt"),
    };
  });

  const value = convert(converters.value, props.things);
  const updatedAt = convert(converters.updatedAt, props.things);

  return (
    <WidgetView
      color="danger"
      value={value}
      header={props.title}
      footerText={updatedAt ? new Date(updatedAt).toLocaleString() : ""}
    >
      <div className="display-4">
        {value}
        <small>{props.unit}</small>
      </div>
    </WidgetView>
  );
};

export default PlainValueWidget;
