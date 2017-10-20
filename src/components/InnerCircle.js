import React from "react";
import { Sector } from "recharts";

const InnerCircle = ({
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
  type
}) => {
  const RADIAN = Math.PI / 180;

  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 12;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  console.log(payload);
  const { startArcQuantile, endArcQuantile, daysAbove } = payload;

  let anglesDiff = endAngle - startAngle;
  if (anglesDiff < 0) anglesDiff = anglesDiff * -1;

  let quantilesDiff = endArcQuantile - startArcQuantile;
  if (quantilesDiff === 0) quantilesDiff = endArcQuantile;

  let oneDeg;
  if (anglesDiff === 0 || quantilesDiff === 0) {
    oneDeg = 0;
  } else {
    oneDeg = anglesDiff / quantilesDiff;
  }

  let theta = (endArcQuantile - daysAbove) * oneDeg;
  if (theta < 0) theta = theta * -1;

  console.log(
    startArcQuantile,
    endArcQuantile,
    daysAbove,
    anglesDiff,
    quantilesDiff,
    oneDeg,
    theta
  );

  return (
    <g>
      <text
        x={cx}
        y={cy - 20}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={12}
      >
        {type}
      </text>
      <text
        x={cx}
        y={cy + 20}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={14}
      >
        {daysAbove}
      </text>
      <line
        stroke="#2A2F36"
        strokeWidth={1}
        x1={cx}
        y1={cy + 15}
        x2={cx}
        y2={innerRadius + 35}
        transform={`rotate(${-endAngle + 90 - theta} ${cx} ${cy})`}
      />
      <circle cx={cx} cy={cy} r={4} />
      <circle cx={cx} cy={cy} r={2} fill="#FBF5F3" />
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
    </g>
  );
};

export default InnerCircle;
