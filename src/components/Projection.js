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

const height = 400;
const width = 600;

@inject("store")
@observer
export default class Prohection extends Component {
  render() {
    const {
      isGraph,
      selectedProjection,
      projected2040Index,
      projected2040ArcData,
      yearlyDaysAboveP2040,
      projected2040YearlyGrouped
    } = this.props.store.app;

    // projected2040YearlyGrouped.map(a => console.log(a.slice()));

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
            innerRadius={100}
            outerRadius={160}
          >
            {cell}
          </Pie>
        </PieChart>

        {isGraph && <TimeSeries width={width} height={height} />}
      </Box>
    );
  }
}
