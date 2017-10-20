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
  const sx = cx + (outerRadius + 15) * cos;
  const sy = cy + (outerRadius + 15) * sin;
  const mx = cx + (outerRadius + 25) * cos;
  const my = cy + (outerRadius + 25) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 14;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

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

  // console.log(
  //   startArcQuantile,
  //   endArcQuantile,
  //   daysAbove,
  //   anglesDiff,
  //   quantilesDiff,
  //   oneDeg,
  //   theta
  // );

  return (
    <g>
      {payload.name === "Not Expected" && (
        <text
          x={cx}
          y={cy - cy / 1.1}
          dy={8}
          textAnchor="middle"
          fill={fill}
          fontSize={13}
        >
          {`A value as low as ${daysAbove} ${daysAbove === 1 ? 'day' : 'days'} is not expected to occur in ${type.slice(11, type.lenght)}`}
        </text>
      )}
      {type === 'Observed Data' ? (
        <text
        x={cx}
        y={cy - 30}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={11}
      >
      {type}
      </text>
      ) : (
      <text
        x={cx}
        y={cy - 20}
        dy={8}
        textAnchor="middle"
        fill={fill}
        fontSize={11}
      >
          
        <tspan x={cx} dy={'-1rem'}>Projection</tspan>
        <tspan x={cx} dy={'1rem'}>{type.slice(11, type.lenght)}</tspan>

      </text>)}
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
        y2={innerRadius + 90}
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
      {payload.name === "New Record" || payload.name === "Not Expected" ? (
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={0}
          textAnchor={textAnchor}
          fill={fill}
        >
          {payload.name}
        </text>
      ) : (
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={0}
          textAnchor={textAnchor}
          fill={fill}
        >
          <tspan x={ex + (cos >= 0 ? 1 : -1) * 12}>
            {" "}
            {`${payload.daysAbove} days > ${payload.t} ˚F`}{" "}
          </tspan>
          <tspan x={ex + (cos >= 0 ? 1 : -1) * 12} dy="1.2em">
            {" "}
            This Year{" "}
          </tspan>
        </text>
      )}
    </g>
  );
};

export default InnerCircle;
