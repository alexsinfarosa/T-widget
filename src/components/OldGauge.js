import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import * as d3 from "d3";

@inject("store")
@observer
export default class Widget extends Component {
  render() {
    const { temperature } = this.props.store.app;
    // console.log(d3);
    // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const COLORS = d3
      .scaleOrdinal()
      .range(["#BBDEFB", "#FFF9C4", "#FFE0B2", "#ffcdd2", "#9E9E9E"]);

    console.log(COLORS(4));
    const margin = {
      top: 50,
      right: 10,
      bottom: 50,
      left: 10
    };
    const width = 700 - margin.left - margin.right;
    const height = 400;

    const config = {
      minAngle: -90,
      maxAngle: 90,
      innerTickRingOffset: -30,
      innerTickCounterclockSpin: 0,
      innerTickNumber: 24,
      outerTickRingOffset: 25,
      outerTickCounterclockSpin: 5,
      outerTickBorderLength: 30
    };

    const radius = Math.min(width, height) / 1.7;
    const percentToDeg = percent => percent * 180 / 60;

    const currentYear = d3
      .arc()
      .innerRadius(radius)
      .outerRadius(radius + 20)
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180));

    const p20402069 = d3
      .arc()
      .innerRadius(radius + 25)
      .outerRadius(radius + 45)
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180));

    const p20692099 = d3
      .arc()
      .innerRadius(radius + 50)
      .outerRadius(radius + 70)
      .startAngle(-90 * (Math.PI / 180))
      .endAngle(90 * (Math.PI / 180));

    const scale = d3
      .scaleLinear()
      .domain([0, 60])
      .range([0, 1]);

    const innerTicks = scale.ticks(config.innerTickNumber).map(tick => ({
      value: tick,
      label: tick
    }));

    const rotate = d => {
      const ratio = scale(d.value);
      const newAngle = config.minAngle + ratio * 180;
      return `rotate(${newAngle}) translate(0, ${-(
        radius + config.innerTickRingOffset
      )})`;
    };

    return (
      <svg width={width} height={height}>
        <text
          textAnchor="middle"
          x={width / 2}
          y={radius}
          style={{ fontSize: "1.5em" }}
        >
          {temperature}
        </text>
        <g transform={`translate(${width / 2}, ${height - margin.bottom})`}>
          <path d={currentYear()} fill={`url(#current)`} />
          <path d={p20402069()} fill={`url(#p1)`} />
          <path d={p20692099()} fill={`url(#p2)`} />
          <circle cx={0} cy={0} r={7} />
          <line
            stroke="#aaa"
            strokeWidth={2}
            x1={0}
            y1={0}
            x2={-205}
            y2={0}
            transform={`rotate(${percentToDeg(temperature)})`}
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
        </g>
      </svg>
    );
  }
}
