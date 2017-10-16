import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Arc } from "@vx/shape";
import { Group } from "@vx/group";
import { GradientPinkBlue } from "@vx/gradient";
import * as d3 from "d3";

// styled components
import { Box } from "styles";

function Label({ x, y, children }) {
  return (
    <text fill="white" textAnchor="middle" x={x} y={y} dy=".33em" fontSize={9}>
      {children}
    </text>
  );
}

const width = 500;
const height = 500;

@inject("store")
@observer
class ObservedGauge extends Component {
  render() {
    const {
      daysAboveThresholdThisYear,
      temperature,
      observedMinMax,
      arcPercentages,
      observedQuantilesNoDuplicates
    } = this.props.store.app;

    const arcs = [
      { label: "Below", quantile: arcPercentages[1], color: "#0088FE" },
      {
        label: "Slightly Below",
        quantile: arcPercentages[2],
        color: "#7FB069"
      },
      {
        label: "Slightly Above",
        quantile: arcPercentages[3],
        color: "#FFBB28"
      },
      { label: "Above", quantile: arcPercentages[4], color: "#E63B2E" },
      { label: "New Record", quantile: 20, color: "#292F36" }
    ];

    const scale = d3
      .scaleLinear()
      .domain(observedMinMax)
      .range([0, 1]);

    const percentToDeg = percent => 180 + percent * 288 / observedMinMax[1];

    // const innerTicks = scale
    //   .ticks(18)
    //   .filter(n => Number.isInteger(n))
    //   .map(tick => ({
    //     value: tick,
    //     label: tick
    //   }));

    const innerTicks = observedQuantilesNoDuplicates.map(tick => ({
      value: tick,
      label: tick
    }));

    const radius = Math.min(width, height) / 1.8;

    const rotate = d => {
      return `translate(${d[0]}, ${d[1]})`;
    };

    const getAngle = d => {};

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
              pieSort={d => getAngle(d)}
              data={arcs}
              pieValue={d => d.quantile}
              outerRadius={radius - 80}
              innerRadius={radius - 130}
              fill={d => d.data.color}
              cornerRadius={3}
              // angle={d => console.log(d)}
              padAngle={0}
              centroid={(centroid, arc) => {
                const [x, y] = centroid;
                const { startAngle, endAngle } = arc;
                s_x = x + radius * Math.cos(startAngle * Math.PI);
                s_y = y + radius * Math.sin(startAngle * Math.PI);
                e_x = x + radius * Math.cos(endAngle * Math.PI);
                e_y = y + radius * Math.sin(endAngle * Math.PI);
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
              transform={`rotate(${percentToDeg(46)})`}
            />

            <g>
              {innerTicks.map((e, i) => {
                // console.log(e);
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
