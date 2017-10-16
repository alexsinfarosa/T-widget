import React, { Component } from "react";
import { inject, observer } from "mobx-react";

import { PieChart, Pie, Sector, Cell } from "recharts";

// styled components
import { Box } from "styles";

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  startAngle,
  midAngle,
  endAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  payload,
  fill
}) => {
  // Provides coordinate for quantiles on the Pie
  const sin = Math.sin(-RADIAN * endAngle);
  const cos = Math.cos(-RADIAN * endAngle);
  const x = cx + (innerRadius - 10) * cos;
  const y = cy + (innerRadius - 10) * sin;

  // Provides coordinates for the arc labels
  const sinL = Math.sin(-RADIAN * midAngle);
  const cosL = Math.cos(-RADIAN * midAngle);
  const xL = cx + (innerRadius + (outerRadius - innerRadius) / 2) * cosL;
  const yL = cy + (innerRadius + (outerRadius - innerRadius) / 2) * sinL;

  // Provides coordinates above each arc of the Pie
  //     const sx = cx + (innerRadius + 0) * cos;
  //     const sy = cy + (innerRadius + 0) * sin;
  //     const mx = cx + (innerRadius - 10) * cos;
  //     const my = cy + (innerRadius - 10) * sin;
  //   <path d={`M${sx},${sy} L${mx},${my}`} stroke={"black"} fill="none" />

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "middle" : "middle"}
        dominantBaseline="central"
      >
        {payload.Q}
      </text>
      <text
        fill="white"
        textAnchor="middle"
        x={xL}
        y={yL}
        dy=".33em"
        fontSize={10}
      >
        {payload.name}
      </text>
      )
    </g>
  );
};

const height = 500;
const width = 800;
const radius = Math.min(width, height) / 2;

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  console.log(props);
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} />
      <circle cx={cx} cy={cy} r={4} />
      <line
        stroke="#2A2F36"
        strokeWidth={1}
        x1={cx}
        y1={cy + 15}
        x2={cx}
        y2={radius / 2 + 45}
        transform={`rotate(${startAngle} ${cx} ${cy})`}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
      >{`${payload.d} days > ${payload.t} ˚F This Year`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 90).toFixed(2)}%)`}
      </text>
    </g>
  );
};

@inject("store")
@observer
export default class ObservedGauge2 extends Component {
  render() {
    const {
      daysAboveThresholdThisYear,
      temperature,
      observedMinMax,
      arcPercentages,
      observedQuantilesNoDuplicates,
      observedIndex
    } = this.props.store.app;

    const data = [
      {
        name: "Below",
        value: arcPercentages[0],
        Q: observedQuantilesNoDuplicates[1],
        d: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Slightly Below",
        value: arcPercentages[1],
        Q: observedQuantilesNoDuplicates[2],
        d: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Slightly Above",
        value: arcPercentages[2],
        Q: observedQuantilesNoDuplicates[3],
        d: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Above",
        value: arcPercentages[3],
        Q: observedQuantilesNoDuplicates[4],
        d: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "New Record",
        value: 10,
        Q: observedQuantilesNoDuplicates[0],
        d: daysAboveThresholdThisYear,
        t: temperature
      }
    ];

    const COLORS = ["#0088FE", "#7FB069", "#FFBB28", "#E63B2E", "#292F36"];
    const cell = data.map((entry, index) => {
      return <Cell key={index} fill={COLORS[index % COLORS.length]} />;
    });

    return (
      <Box>
        <h3>Observed Data</h3>
        <PieChart width={width} height={height}>
          <Pie
            activeIndex={observedIndex}
            activeShape={renderActiveShape}
            startAngle={250}
            endAngle={-110}
            data={data}
            cx={width / 2}
            cy={height / 2}
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={100}
            outerRadius={170}
          >
            {cell}
          </Pie>
        </PieChart>
      </Box>
    );
  }
}
