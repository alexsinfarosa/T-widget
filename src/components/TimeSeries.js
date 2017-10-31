import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  Line
} from "recharts";

import { arcColoring } from "utils";

import GraphLabels from "./GraphLables";

@inject("store")
@observer
class TimeSeries extends Component {
  render() {
    const { temperature, observedMean } = this.props.store.app;
    const { index, width, height, arcData, graphData } = this.props;
    const data = graphData.slice();

    return (
      <ComposedChart width={width} height={height} data={data}>
        <XAxis dataKey="year" tick={<GraphLabels />} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend
          verticalAlign="top"
          align="right"
          height={36}
          iconSize={18}
          iconType="rect"
          payload={[
            {
              value: `Days above ${temperature} ˚F`,
              type: "rect",
              color: "#ddd"
            },
            {
              value: `Observed Data Mean ${observedMean}`,
              type: "line",
              color: "#ff7300"
            }
          ]}
        />
        <Bar dataKey="days above">
          {data.map((e, i) => {
            if (i === data.length - 1) {
              return <Cell key={i} fill={arcColoring(arcData[index].name)} />;
            }
            return <Cell key={i} fill="#ddd" />;
          })}
        </Bar>
        <Line type="monotone" dataKey="mean" stroke="#ff7300" dot={false} />
      </ComposedChart>
    );
  }
}

export default TimeSeries;
