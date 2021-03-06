import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { PieChart, Pie, Cell } from "recharts";

import { arcColoring } from "utils";

// components
import PieLabels from "./PieLabels";
import InnerCircle from "./InnerCircle";
import TimeSeries from "./TimeSeries";

// styled components
import { Box } from "styles";

let height = 450;
let width = 600;

@inject("store")
@observer
export default class ObservedGauge extends Component {
  render() {
    const {
      observedIndex,
      observedQuantiles,
      observedArcData,
      isGraph,
      observedDataGraph
    } = this.props.store.app;
    // observedArcData.map(x => console.log(x));

    const cell = observedArcData.map((arc, index) => {
      return <Cell key={index} fill={arcColoring(arc.name)} />;
    });

    return (
      <Box bordered svg>
        <PieChart width={width} height={height}>
          <Pie
            activeIndex={observedIndex}
            activeShape={<InnerCircle type="Observed Data" />}
            startAngle={90 + 144}
            endAngle={-126}
            data={observedArcData}
            cx={width / 2}
            cy={height / 2}
            labelLine={false}
            label={PieLabels}
            innerRadius={80}
            outerRadius={150}
          >
            {cell}
          </Pie>
        </PieChart>
        {isGraph && (
          <TimeSeries
            width={width - 30}
            height={height - 30}
            index={observedIndex}
            quantiles={observedQuantiles}
            arcData={observedArcData}
            graphData={observedDataGraph}
          />
        )}
      </Box>
    );
  }
}
