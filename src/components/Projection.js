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

const height = 450;
const width = 600;

@inject("store")
@observer
export default class Prohection extends Component {
  render() {
    const {
      isGraph,
      selectedProjection,
      projectedQuantiles,
      projectedIndex,
      projectedArcData,
      projectedDataGraph
    } = this.props.store.app;

    const cell = projectedArcData.map((arc, index) => {
      return <Cell key={index} fill={arcColoring(arc.name)} />;
    });

    return (
      <Box bordered>
        <PieChart width={width} height={height}>
          <Pie
            activeIndex={projectedIndex}
            activeShape={<InnerCircle type={selectedProjection} />}
            startAngle={90 + 144}
            endAngle={-126}
            data={projectedArcData}
            cx={width / 2}
            cy={height / 2}
            labelLine={false}
            label={PieLabels}
            innerRadius={80}
            outerRadius={140}
          >
            {cell}
          </Pie>
        </PieChart>

        {isGraph && (
          <TimeSeries
            width={width}
            height={height}
            index={projectedIndex}
            quantiles={projectedQuantiles}
            arcData={projectedArcData}
            graphData={projectedDataGraph}
          />
        )}
      </Box>
    );
  }
}
