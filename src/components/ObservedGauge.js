import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Arc } from "@vx/shape";
import { Group } from "@vx/group";
import { GradientPinkBlue } from "@vx/gradient";
import * as d3 from "d3";

// styled components
import { Box } from "styles";

const browsers = [
  { label: "Slightly Above", usage: "20" },
  { label: "Above", usage: "20" },
  { label: "New Record", usage: "20" },
  { label: "Below", usage: "20" },
  { label: "Slightly Below", usage: "20" }
];

function Label({ x, y, children }) {
  return (
    <text fill="white" textAnchor="middle" x={x} y={y} dy=".33em" fontSize={9}>
      {children}
    </text>
  );
}

const width = 500;
const height = 500;

const fillArcs = d => {
  const { label } = d.data;
  if (label === "New Record") return "#292F36";
  if (label === "Below") return "#0088FE";
  if (label === "Slightly Below") return "#7FB069";
  if (label === "Slightly Above") return "#FFBB28";
  if (label === "Above") return "#E63B2E";
};

@inject("store")
@observer
class ObservedGauge extends Component {
  render() {
    const {
      daysAboveThresholdThisYear,
      temperature,
      observedMinMax,
      observedQuantiles,
      observedIndex
    } = this.props.store.app;

    console.log(observedMinMax);
    console.log(observedQuantiles);
    console.log(observedIndex);

    const scale = d3
      .scaleLinear()
      .domain(observedMinMax)
      .range([0, 1]);

    const percentToDeg = percent => percent * 288 / observedMinMax[1];
    const innerTicks = scale
      .ticks(24)
      .filter(n => Number.isInteger(n))
      .map(tick => ({
        value: tick,
        label: tick
      }));

    const radius = Math.min(width, height) / 1.8;

    const rotate = d => {
      const ratio = scale(d.value);
      const newAngle = -144 + ratio * 288;
      console.log(newAngle);
      return `rotate(${newAngle}) translate(0, ${-(radius / 2.1)})`;
    };

    return (
      <Box>
        <h3>
          Observed Data: {daysAboveThresholdThisYear} Days > {temperature}˚F
          This Year
        </h3>
        <svg width={width} height={height}>
          <GradientPinkBlue id="gradients" />
          <rect
            x={0}
            y={0}
            rx={14}
            width={width}
            height={height}
            fill="white"
          />
          <Group top={height / 2} left={width / 2}>
            <Arc
              data={browsers}
              pieValue={d => d.usage}
              outerRadius={radius - 80}
              innerRadius={radius - 130}
              fill={d => fillArcs(d)}
              cornerRadius={3}
              padAngle={0}
              centroid={(centroid, arc) => {
                const [x, y] = centroid;
                const { startAngle, endAngle } = arc;
                if (endAngle - startAngle < 0.1) return null;
                return (
                  <Label x={x} y={y}>
                    {arc.data.label}
                  </Label>
                );
              }}
            />
            <circle cx={0} cy={0} r={4} />
            <line
              stroke="#2A2F36"
              strokeWidth={1}
              x1={0}
              y1={-15}
              x2={0}
              y2={radius / 2.1 - 6}
              transform={`rotate(${percentToDeg(daysAboveThresholdThisYear)})`}
            />
            <g>
              {innerTicks.map((e, i) => {
                return (
                  <text
                    style={{ fill: "#333", fontSize: "11px" }}
                    textAnchor="middle"
                    key={i}
                    transform={rotate(e)}
                  >
                    {e.label}
                  </text>
                );
              })}
            </g>
          </Group>
        </svg>
      </Box>
    );
  }
}

export default ObservedGauge;
