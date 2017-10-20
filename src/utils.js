import format from "date-fns/format";
import isAfter from "date-fns/is_after";
import getYear from "date-fns/get_year";

export const reevaluateQuantiles = q => {
  console.log(`original: [${q}]`);
  const _min = q[0];
  const _25 = q[1];
  const _50 = q[2];
  const _75 = q[3];
  const _max = q[4];

  if (_min === _25 && _25 === _50 && _50 === _75 && _75 === _max) {
    console.log(`q = [max]: [${_50}, ${_max}]`);
    return [_max];
  }

  if (_min === _25 && _25 === _50 && _50 === _75) {
    console.log(`q = [75, max]: [${_50}, ${_max}]`);
    return [_75, _max];
  }

  if (_min === _25 && _25 === _50) {
    console.log(`q = [50, 75, max]: [${_50}, ${_75}, ${_max}]`);
    return [_50, _75, _max];
  }

  if (_min === _25) {
    console.log(`q = [25, 50, 75, max]: [${_25}, ${_50}, ${_75}, ${_max}]`);
    return [_25, _50, _75, _max];
  }

  console.log(`q = [min, 25, 50, 75, max]: [${q}]`);
  return q;
};

// returns the index of the array where the value d is closest to
export const index = (daysAbovethreshold, quantiles) => {
  const d = daysAbovethreshold; // ex: 13
  const q = quantiles; // ex: [3,11,23]

  if (q.length === 5) {
    console.log(`d: ${d}, Qlength: 5`);
    // is the min
    if (d === q[0]) return 0;
    // is below
    if (d > q[0] && d < q[1]) return 1;
    // is the 25th percentile
    if (d === q[1]) return 2;
    // is slightly below
    if (d > q[1] && d < q[2]) return 3;
    // is the mean
    if (d === q[2]) return 4;
    // is slightly above
    if (d > q[2] && d < q[3]) return 5;
    // is the 75% percentile
    if (d === q[3]) return 6;
    // is above
    if (d > q[3] && d < q[4]) return 7;
    // is equal to max
    if (d === q[4]) return 8;
    // new record
    if (d < q[0] || d > q[4]) return 9;
  }

  if (q.length === 4) {
    console.log(`d: ${d}, Qlength: 4`);
    // is the 25%
    if (d === q[0]) return 0;
    // is slightly below
    if (d > q[0] && d < q[1]) return 1;
    // is the Mean
    if (d === q[1]) return 2;
    // is slightly above
    if (d > q[1] && d < q[2]) return 3;
    // is the 75%
    if (d === q[2]) return 4;
    // is above
    if (d > q[2] && d < q[3]) return 5;
    // is the Max
    if (d === q[3]) return 6;
    // new record
    if (d < q[0] || d > q[3]) return 7;
  }

  if (q.length === 3) {
    console.log(`d: ${d}, Qlength: 3`);
    // is the Mean
    if (d === q[0]) return 0;
    // is slightly above
    if (d > q[0] && d < q[1]) return 1;
    // is the 75th percentile
    if (d === q[1]) return 2;
    // is above
    if (d > q[1] && d < q[2]) return 3;
    // is the Max
    if (d === q[2]) return 4;
    // new record
    if (d < q[0] || d > q[2]) return 5;
  }

  if (q.length === 2) {
    console.log(`d: ${d}, Qlength: 2`);
    // is the 75%
    if (d === q[0]) return 0;
    // is above
    if (d > q[0]) return 1;
    // is slightly above
    if (d < q[0]) return 2;
  }

  console.log(`d: ${d}, Qlength: 1`);
  // is the Mean
  if (d === q[0]) return 0;
  // is slightly above
  if (d > q[0]) return 1;
  // is slightly below
  if (d < q[0]) return 2;
};

export const arcColoring = name => {
  if (name === "Min") return "#073B3A";
  if (name === "Below") return "#0088FE";
  if (name === "25%") return "#073B3A";
  if (name === "Slightly Below") return "#7FB069";
  if (name === "Mean") return "#073B3A";
  if (name === "Slightly Above") return "#FFBB28";
  if (name === "75%") return "#073B3A";
  if (name === "Above") return "#E63B2E";
  if (name === "Max") return "#073B3A";
  if (name === "New Record" || name === "Not Expected") return "#292F36";
};

export const arcData = (q, days, temp, darkArcLabel) => {
  if (q.length === 5) {
    return [
      {
        name: "Min",
        startArcQuantile: q[0],
        endArcQuantile: q[0],
        daysAbove: days,
        t: temp
      },
      {
        name: "Below",
        value: 1,
        startArcQuantile: q[0],
        endArcQuantile: q[1],
        daysAbove: days,
        t: temp
      },
      {
        name: "25%",
        startArcQuantile: q[1],
        endArcQuantile: q[1],
        daysAbove: days,
        t: temp
      },
      {
        name: "Slightly Below",
        value: 1,
        startArcQuantile: q[1],
        endArcQuantile: q[2],
        daysAbove: days,
        t: temp
      },
      {
        name: "Mean",
        startArcQuantile: q[2],
        endArcQuantile: q[2],
        daysAbove: days,
        t: temp
      },
      {
        name: "Slightly Above",
        value: 1,
        startArcQuantile: q[2],
        endArcQuantile: q[3],
        daysAbove: days,
        t: temp
      },
      {
        name: "75%",
        startArcQuantile: q[3],
        endArcQuantile: q[3],
        daysAbove: days,
        t: temp
      },
      {
        name: "Above",
        value: 1,
        startArcQuantile: q[3],
        endArcQuantile: q[4],
        daysAbove: days,
        t: temp
      },
      {
        name: "Max",
        startArcQuantile: q[4],
        endArcQuantile: q[4],
        daysAbove: days,
        t: temp
      },
      {
        name: darkArcLabel,
        value: 1,
        startArcQuantile: q[4],
        endArcQuantile: q[0],
        d: days,
        t: temp
      }
    ];
  }

  if (q.length === 4) {
    return [
      {
        name: "25%",
        startArcQuantile: q[0],
        endArcQuantile: q[0],
        daysAbove: days,
        t: temp
      },
      {
        name: "Slightly Below",
        value: 1,
        startArcQuantile: q[0],
        endArcQuantile: q[1],
        daysAbove: days,
        t: temp
      },
      {
        name: "Mean",
        startArcQuantile: q[1],
        endArcQuantile: q[1],
        daysAbove: days,
        t: temp
      },
      {
        name: "Slightly Above",
        value: 1,
        startArcQuantile: q[1],
        endArcQuantile: q[2],
        daysAbove: days,
        t: temp
      },
      {
        name: "75%",
        startArcQuantile: q[2],
        endArcQuantile: q[2],
        daysAbove: days,
        t: temp
      },
      {
        name: "Above",
        value: 1,
        startArcQuantile: q[2],
        endArcQuantile: q[3],
        daysAbove: days,
        t: temp
      },
      {
        name: "Max",
        startArcQuantile: q[3],
        endArcQuantile: q[3],
        daysAbove: days,
        t: temp
      },
      {
        name: darkArcLabel,
        value: 1,
        startArcQuantile: q[3],
        endArcQuantile: q[0],
        d: days,
        t: temp
      }
    ];
  }
  if (q.length === 3) {
    return [
      {
        name: "Mean",
        startArcQuantile: q[0],
        endArcQuantile: q[0],
        daysAbove: days,
        t: temp
      },
      {
        name: "Slightly Above",
        value: 1,
        startArcQuantile: q[0],
        endArcQuantile: q[1],
        daysAbove: days,
        t: temp
      },
      {
        name: "75%",
        startArcQuantile: q[1],
        endArcQuantile: q[1],
        daysAbove: days,
        t: temp
      },
      {
        name: "Above",
        value: 1,
        startArcQuantile: q[1],
        endArcQuantile: q[2],
        daysAbove: days,
        t: temp
      },
      {
        name: "Max",
        startArcQuantile: q[2],
        endArcQuantile: q[2],
        daysAbove: days,
        t: temp
      },
      {
        name: darkArcLabel,
        value: 1,
        startArcQuantile: q[2],
        endArcQuantile: q[0],
        d: days,
        t: temp
      }
    ];
  }
  // there is no length === 1
  if (q.length === 2) {
    return [
      {
        name: "Mean",
        startArcQuantile: q[0],
        endArcQuantile: q[0],
        daysAbove: days,
        t: temp
      },
      {
        name: "Above",
        value: 1,
        startArcQuantile: q[0],
        endArcQuantile: q[1],
        daysAbove: days,
        t: temp
      },
      {
        name: "Max",
        startArcQuantile: q[2],
        endArcQuantile: q[2],
        daysAbove: days,
        t: temp
      },
      {
        name: darkArcLabel,
        value: 1,
        startArcQuantile: q[2],
        endArcQuantile: q[0],
        d: days,
        t: temp
      }
    ];
  }
};

export const transposeReduce = d => {
  const date = d[d.length - 1][0];
  const arrWithNoDate = d.map(arr => arr.slice(1, arr.length));
  const aboveDaysAtSameTemp = arrWithNoDate[0].map((col, i) =>
    arrWithNoDate.map(row => row[i])
  );
  let results = aboveDaysAtSameTemp.map(arr => arr.reduce((a, b) => a + b, 0));
  results.unshift(date);
  return results;
};
