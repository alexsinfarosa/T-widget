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

  const { name } = payload;

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "middle" : "middle"}
        dominantBaseline="central"
      >
        {payload.endArcQuantile}
      </text>
      {(name === "Min" ||
        name === "25%" ||
        name === "Mean" ||
        name === "75%" ||
        name === "Max") && <circle cx={xL} cy={yL} r={12} />}
      <text
        fill="#FBF5F3"
        textAnchor="middle"
        x={xL}
        y={yL}
        dy=".33em"
        fontSize={9}
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

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  const { startArcQuantile, endArcQuantile, daysAbove } = payload;

  let anglesDiff = endAngle - startAngle;
  if (anglesDiff < 0) anglesDiff = anglesDiff * -1;

  let quantilesDiff = endArcQuantile - startArcQuantile;
  if (quantilesDiff === 0) quantilesDiff = endArcQuantile;

  const oneDeg = anglesDiff / quantilesDiff;

  let theta = (endArcQuantile - daysAbove) * oneDeg;
  if (theta < 0) theta = theta * -1;

  return (
    <g>
      <text
        x={cx}
        y={cy - 20}
        dy={8}
        textAnchor="middle"
        fill={fill}
        dy=".33em"
        fontSize={12}
      >
        Observed Data
      </text>
      <text
        x={cx}
        y={cy + 20}
        dy={8}
        textAnchor="middle"
        fill={fill}
        dy=".33em"
        fontSize={14}
      >
        {daysAbove}
      </text>
      <circle cx={cx} cy={cy} r={4} />
      <circle cx={cx} cy={cy} r={2} fill="#FBF5F3" />
      <line
        stroke="#2A2F36"
        strokeWidth={1}
        x1={cx}
        y1={cy + 15}
        x2={cx}
        y2={radius / 2 + 50}
        transform={`rotate(${-endAngle + 90 - theta} ${cx} ${cy})`}
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
      >{`${payload.daysAbove} days > ${payload.t} ˚F This Year`}</text>
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
        name: "Min",
        startArcQuantile: observedQuantilesNoDuplicates[0],
        endArcQuantile: observedQuantilesNoDuplicates[0],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Below",
        value: arcPercentages[0],
        startArcQuantile: observedQuantilesNoDuplicates[0],
        endArcQuantile: observedQuantilesNoDuplicates[1],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "25%",
        startArcQuantile: observedQuantilesNoDuplicates[1],
        endArcQuantile: observedQuantilesNoDuplicates[1],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Slightly Below",
        value: arcPercentages[1],
        startArcQuantile: observedQuantilesNoDuplicates[1],
        endArcQuantile: observedQuantilesNoDuplicates[2],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Mean",
        startArcQuantile: observedQuantilesNoDuplicates[2],
        endArcQuantile: observedQuantilesNoDuplicates[2],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Slightly Above",
        value: arcPercentages[2],
        startArcQuantile: observedQuantilesNoDuplicates[2],
        endArcQuantile: observedQuantilesNoDuplicates[3],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "75%",
        startArcQuantile: observedQuantilesNoDuplicates[3],
        endArcQuantile: observedQuantilesNoDuplicates[3],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Above",
        value: arcPercentages[3],
        startArcQuantile: observedQuantilesNoDuplicates[3],
        endArcQuantile: observedQuantilesNoDuplicates[4],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "Max",
        startArcQuantile: observedQuantilesNoDuplicates[4],
        endArcQuantile: observedQuantilesNoDuplicates[4],
        daysAbove: daysAboveThresholdThisYear,
        t: temperature
      },
      {
        name: "New Record",
        value: 10,
        startArcQuantile: observedQuantilesNoDuplicates[4],
        endArcQuantile: observedQuantilesNoDuplicates[0],
        d: daysAboveThresholdThisYear,
        t: temperature
      }
    ];

    const COLORS = [
      "#073B3A",
      "#0088FE",
      "#073B3A",
      "#7FB069",
      "#073B3A",
      "#FFBB28",
      "#073B3A",
      "#E63B2E",
      "#073B3A",
      "#292F36"
    ];
    const cell = data.map((entry, index) => {
      return <Cell key={index} fill={COLORS[index % COLORS.length]} />;
    });

    return (
      <Box>
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
