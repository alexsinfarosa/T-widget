import React from "react";

const PieLabels = ({
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
  const RADIAN = Math.PI / 180;

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
        name === "Max") && <circle cx={xL} cy={yL} r={14} fill="#565656" />}
      <text
        fill="#FBF5F3"
        textAnchor="middle"
        x={xL}
        y={yL}
        dy=".33em"
        fontSize={10}
      >
        {payload.name}
      </text>
    </g>
  );
};

export default PieLabels;
