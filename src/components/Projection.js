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
      projected2040Quantiles,
      projected2040Index,
      projected2040ArcData,
      projected2040DataGraph
    } = this.props.store.app;

    const cell = projected2040ArcData.map((arc, index) => {
      return <Cell key={index} fill={arcColoring(arc.name)} />;
    });

    return (
      <Box>
        <PieChart width={width} height={height}>
          <Pie
            activeIndex={projected2040Index}
            activeShape={<InnerCircle type={selectedProjection} />}
            startAngle={90 + 144}
            endAngle={-126}
            data={projected2040ArcData}
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
            index={projected2040Index}
            quantiles={projected2040Quantiles}
            arcData={projected2040ArcData}
            graphData={projected2040DataGraph}
          />
        )}
      </Box>
    );
  }
}
