import React from "react";
import { Sector } from "recharts";
import { projectionHeaderMessage } from "utils";

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

  const { startArcQuantile, endArcQuantile, daysAbove, name } = payload;

  const anglesDiff = Math.abs(endAngle - startAngle);

  let quantileDiff = Math.abs(endArcQuantile - startArcQuantile);
  if (quantileDiff === 0) quantileDiff = endArcQuantile;
  if (isNaN(quantileDiff)) quantileDiff = 0;

  let oneDeg = Math.abs(anglesDiff / quantileDiff);
  if (isNaN(oneDeg) || oneDeg === Infinity) oneDeg = 0;

  let theta;
  if (name === "Not Expected" || name === "New Record") {
    theta = anglesDiff / 2;
  } else {
    theta = Math.abs((endArcQuantile - daysAbove) * oneDeg);
  }
  if (isNaN(theta)) theta = 0;

  // console.log(type);
  // console.log(payload);
  // console.log(
  //   anglesDiff,
  //   endArcQuantile,
  //   startArcQuantile,
  //   quantileDiff,
  //   daysAbove,
  //   oneDeg,
  //   theta
  // );

  return (
    <g>
      {payload.name === "Not Expected" && (
        <text
          x={cx}
          y={cy - cy / 1.05}
          dy={8}
          textAnchor="middle"
          fill={fill}
          fontSize={13}
        >
          {`Every year during ${type.slice(
            11,
            type.lenght
          )} will have more than ${daysAbove} ${daysAbove === 1
            ? "day"
            : "days"} > ${payload.t}˚F`}
        </text>
      )}

      {type !== "Observed Data" &&
        payload.name !== "Not Expected" && (
          <text
            x={cx}
            y={cy - cy / 1.1}
            dy={8}
            textAnchor="middle"
            fill={fill}
            fontSize={13}
          >
            {`This year's ${daysAbove} ${daysAbove === 1
              ? "day"
              : "days"} would be considered ${projectionHeaderMessage(
              payload.name
            )} in ${type.slice(11, type.lenght)}`}
          </text>
        )}

      {type === "Observed Data" ? (
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
          <tspan x={cx} dy={"-1.2em"}>
            Projection
          </tspan>
          <tspan x={cx} dy={"1.2em"}>
            {type.slice(11, type.lenght)}
          </tspan>
        </text>
      )}
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
