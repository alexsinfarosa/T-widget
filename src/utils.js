import { jStat } from "jStat";
import isEqual from "lodash.isequal";

export const determineQuantiles = d => {
  let original = jStat
    .quantiles(d, [0, 0.25, 0.5, 0.75, 1])
    .map(x => Math.round(x));
  console.log(`original: ${original}`);

  let q = {};
  original.forEach((value, i) => {
    let k;
    if (i === 0) k = 0;
    if (i === 1) k = 25;
    if (i === 2) k = 50;
    if (i === 3) k = 75;
    if (i === 4) k = 100;
    q[value] = k;
  });

  console.log(q);

  // check if 25%, mean and 75% are equal
  if (q[1] === q[2] && q[2] === q[3]) {
    q = jStat.quantiles(d, [0, 0.5, 1]).map(x => Math.round(x));
    console.log({ "0": q[0], "50": q[1], "100": q[2] });
    return { "0": q[0], "50": q[1], "100": q[2] };
  }

  // check if 25%, mean and 75% are equal
  if (q[0] === q[1] && q[1] === q[2] && q[2] === q[3]) {
    q = jStat.quantiles(d, [0, 0.5, 1]).map(x => Math.round(x));
    console.log({ "0": q[0], "50": q[1], "100": q[2] });
    return { "0": q[0], "50": q[1], "100": q[2] };
  }

  // check 25% if equal to mean
  if (q[1] === q[2]) {
    console.log("ONE");
    q = jStat.quantiles(d, [0, 0.5, 0.75, 1]).map(x => Math.round(x));
    if (q[0] === q[1]) {
      q = jStat.quantiles(d, [0.5, 0.75, 1]).map(x => Math.round(x));
      if (q[0] === q[1]) {
        q = jStat.quantiles(d, [0.5, 1]).map(x => Math.round(x));
        if (q[0] === q[1]) {
          q = jStat.quantiles(d, [1]).map(x => Math.round(x));
          console.log({ "100": q[0] });
          return { "100": q[0] };
        }
        console.log({ "50": q[0], "100": q[1] });
        return { "50": q[0], "100": q[1] };
      }
      console.log({ "50": q[0], "75": q[1], "100": q[2] });
      return { "50": q[0], "75": q[1], "100": q[2] };
    }
    console.log({ "0": q[0], "50": q[1], "75": q[2], "100": q[3] });
    return { "0": q[0], "50": q[1], "75": q[2], "100": q[3] };
  }

  // check 75% if equal to mean
  if (q[2] === q[3]) {
    console.log("TWO");
    q = jStat.quantiles(d, [0, 0.25, 0.5, 1]).map(x => Math.round(x));
    if (q[0] === q[1]) {
      q = jStat.quantiles(d, [0.25, 0.5, 1]).map(x => Math.round(x));
      if (q[0] === q[1]) {
        q = jStat.quantiles(d, [0.5, 1]).map(x => Math.round(x));
        if (q[0] === q[1]) {
          q = jStat.quantiles(d, [1]).map(x => Math.round(x));
          console.log({ "100": q[0] });
          return { "100": q[0] };
        }
        console.log({ "50": q[0], "100": q[1] });
        return { "50": q[0], "100": q[1] };
      }
      console.log({ "25": q[0], "50": q[1], "100": q[2] });
      return { "25": q[0], "50": q[1], "100": q[2] };
    }
    console.log({ "0": q[0], "25": q[1], "50": q[2], "100": q[3] });
    return { "0": q[0], "25": q[1], "50": q[2], "100": q[3] };
  }

  // check if min=25%
  if (q[0] === q[1]) {
    console.log("THREE");
    q = jStat.quantiles(d, [0.25, 0.5, 0.75, 1]).map(x => Math.round(x));
    if (q[0] === q[1]) {
      q = jStat.quantiles(d, [0.5, 0.75, 1]).map(x => Math.round(x));
      if (q[0] === q[1]) {
        q = jStat.quantiles(d, [0.5, 1]).map(x => Math.round(x));
        if (q[0] === q[1]) {
          q = jStat.quantiles(d, [1]).map(x => Math.round(x));
          console.log({ "100": q[0] });
          return { "100": q[0] };
        }
        console.log({ "50": q[0], "100": q[1] });
        return { "50": q[0], "100": q[1] };
      }
      console.log({ "50": q[0], "75": q[1], "100": q[2] });
      return { "50": q[0], "75": q[1], "100": q[2] };
    }
    console.log({ "25": q[0], "50": q[1], "75": q[2], "100": q[3] });
    return { "25": q[0], "50": q[1], "75": q[2], "100": q[3] };
  }

  // check if 75%=max
  if (q[3] === q[4]) {
    console.log("FOUR");
    q = jStat.quantiles(d, [0, 0.25, 0.5, 1]).map(x => Math.round(x));
    if (q[0] === q[1]) {
      q = jStat.quantiles(d, [0.25, 0.5, 1]).map(x => Math.round(x));
      if (q[0] === q[1]) {
        q = jStat.quantiles(d, [0.5, 1]).map(x => Math.round(x));
        if (q[0] === q[1]) {
          q = jStat.quantiles(d, [1]).map(x => Math.round(x));
          console.log({ "100": q[0] });
          return { "100": q[0] };
        }
        console.log({ "50": q[0], "100": q[1] });
        return { "50": q[0], "100": q[1] };
      }
      console.log({ "25": q[0], "50": q[1], "100": q[2] });
      return { "25": q[0], "50": q[1], "100": q[2] };
    }
    console.log({ "0": q[0], "25": q[1], "50": q[2], "100": q[3] });
    return { "0": q[0], "25": q[1], "50": q[2], "100": q[3] };
  }

  console.log({ "0": q[0], "25": q[1], "50": q[2], "75": q[3], "100": q[4] });
  return { "0": q[0], "25": q[1], "50": q[2], "75": q[3], "100": q[4] };
};

export const index = (daysAbovethreshold, quantiles) => {
  const d = daysAbovethreshold; // ex: 13
  const q = quantiles; // ex: [3,11,23]

  if (q.length === 5) {
    // console.log(`d: ${d}, q = [min, .25, .5, .75, 1]: [${q}]`);
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
    // console.log(
    //   `d: ${d}, q = [min, mean, 75, max]: [${q[0]}, ${q[1]}, ${q[2]}, ${q[3]}]`
    // );
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
    // console.log(`d: ${d}, q = [mean, 75, max]: [${q[0]}, ${q[1]}, ${q[2]}]`);
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
    // console.log(`d: ${d}, q = [mean, max]: [${q[0]}, ${q[1]}]`);
    // is the 75% or less
    if (d === q[0]) return 0;
    // is above
    if (d > q[0] && d < q[1]) return 1;
    // is max
    if (d === q[1]) return 2;
    // Not expected
    if (d < q[0] || d > q[1]) return 3;
  }

  if (q.length === 1) {
    // console.log(`d: ${d}, q = [max]: [${q[0]}]`);
    // is the Mean
    if (d === q[0]) return 0;
    // is slightly above
    if (d > q[0]) return 1;
    // is slightly below
    if (d < q[0]) return 2;
  }
};

export const arcColoring = name => {
  if (name === "Min") return "#565656";
  if (name === "Below") return "#0088FE";
  if (name === "25%") return "#565656";
  if (name === "Slightly Below") return "#7FB069";
  if (name === "Mean") return "#565656";
  if (name === "Slightly Above") return "#FFBB28";
  if (name === "75%") return "#565656";
  if (name === "Above") return "#E63B2E";
  if (name === "Max") return "#565656";
  if (name === "New Record" || name === "Not Expected") return "#292F36";
  if (name === "Always Observed") return "#565656";
};

export const projectionHeaderMessage = name => {
  if (name === "Min") return "the minimum value";
  if (name === "Below") return "below normal";
  if (name === "25%") return "the 25% percentile";
  if (name === "Slightly Below") return "slightly below the normal";
  if (name === "Mean") return "the mean value";
  if (name === "Slightly Above") return "slightly above the normal";
  if (name === "75%") return "the 75% percentile";
  if (name === "Above") return "above the normal";
  if (name === "Max") return "the maximum value";
};

export const arcData = (q, days, temp, darkArcLabel) => {
  const keys = Object.keys(q);
  const values = Object.values(q);
  if (values.length === 5) {
    return [
      {
        name: "Min",
        startArcQuantile: values[0],
        endArcQuantile: values[0],
        daysAbove: days,
        t: temp,
        value: 0
      },
      {
        name: "Below",
        startArcQuantile: values[0],
        endArcQuantile: values[1],
        daysAbove: days,
        t: temp,
        value: 1
      },
      {
        name: "25%",
        startArcQuantile: values[1],
        endArcQuantile: values[1],
        daysAbove: days,
        t: temp,
        value: 0
      },
      {
        name: "Slightly Below",
        startArcQuantile: values[1],
        endArcQuantile: values[2],
        daysAbove: days,
        t: temp,
        value: 1
      },
      {
        name: "Mean",
        startArcQuantile: values[2],
        endArcQuantile: values[2],
        daysAbove: days,
        t: temp,
        value: 0
      },
      {
        name: "Slightly Above",
        startArcQuantile: values[2],
        endArcQuantile: values[3],
        daysAbove: days,
        t: temp,
        value: 1
      },
      {
        name: "75%",
        startArcQuantile: values[3],
        endArcQuantile: values[3],
        daysAbove: days,
        t: temp,
        value: 0
      },
      {
        name: "Above",
        startArcQuantile: values[3],
        endArcQuantile: values[4],
        daysAbove: days,
        t: temp,
        value: 1
      },
      {
        name: "Max",
        startArcQuantile: values[4],
        endArcQuantile: values[4],
        daysAbove: days,
        t: temp,
        value: 0
      },
      {
        name: darkArcLabel,
        startArcQuantile: values[4],
        endArcQuantile: values[0],
        daysAbove: days,
        t: temp,
        value: 1
      }
    ];
  }

  if (values.length === 4) {
    if (isEqual(keys, ["0", "50", "75", "100"])) {
      return [
        {
          name: "Min",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Slightly Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "75%",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Above",
          startArcQuantile: values[2],
          endArcQuantile: values[3],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Max",
          startArcQuantile: values[3],
          endArcQuantile: values[3],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: darkArcLabel,
          startArcQuantile: values[3],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 1
        }
      ];
    }
    if (isEqual(keys, ["0", "25", "50", "100"])) {
      return [
        {
          name: "Min",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "25%",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Slightly Below",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Mean",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Above",
          startArcQuantile: values[2],
          endArcQuantile: values[3],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Max",
          startArcQuantile: values[3],
          endArcQuantile: values[3],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: darkArcLabel,
          startArcQuantile: values[3],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 1
        }
      ];
    }
    if (isEqual(keys, ["25", "50", "75", "100"])) {
      return [
        {
          name: "25%",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Slightly Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Slightly Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "75%",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Above",
          startArcQuantile: values[2],
          endArcQuantile: values[3],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Max",
          startArcQuantile: values[3],
          endArcQuantile: values[3],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: darkArcLabel,
          startArcQuantile: values[3],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 1
        }
      ];
    }
  }
  if (values.length === 3) {
    if (isEqual(keys, ["50", "75", "100"])) {
      return [
        {
          name: "Mean",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Slightly Above",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "75%",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Max",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: darkArcLabel,
          startArcQuantile: values[2],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 1
        }
      ];
    }

    if (isEqual(keys, ["25", "50", "100"])) {
      return [
        {
          name: "25%",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Slightly Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Max",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: darkArcLabel,
          startArcQuantile: values[2],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 1
        }
      ];
    }
    if (isEqual(keys, ["0", "50", "100"])) {
      return [
        {
          name: "Min",
          startArcQuantile: values[0],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Below",
          startArcQuantile: values[0],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Mean",
          startArcQuantile: values[1],
          endArcQuantile: values[1],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: "Above",
          startArcQuantile: values[1],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 1
        },
        {
          name: "Max",
          startArcQuantile: values[2],
          endArcQuantile: values[2],
          daysAbove: days,
          t: temp,
          value: 0
        },
        {
          name: darkArcLabel,
          startArcQuantile: values[2],
          endArcQuantile: values[0],
          daysAbove: days,
          t: temp,
          value: 1
        }
      ];
    }
  }
  // there is no length === 1
  if (values.length === 2) {
    return [
      {
        name: "Mean",
        startArcQuantile: values[0],
        endArcQuantile: values[0],
        daysAbove: days,
        t: temp,
        value: 0
      },
      {
        name: "Above",
        startArcQuantile: values[0],
        endArcQuantile: values[1],
        daysAbove: days,
        t: temp,
        value: 1
      },
      {
        name: "Max",
        startArcQuantile: values[1],
        endArcQuantile: values[1],
        daysAbove: days,
        t: temp,
        value: 0
      },
      {
        name: darkArcLabel,
        startArcQuantile: values[1],
        endArcQuantile: values[0],
        daysAbove: days,
        t: temp,
        value: 1
      }
    ];
  }

  if (values.length === 1) {
    return [
      {
        name: "Always Observed",
        // startArcQuantile: values[0],
        // endArcQuantile: values[0],
        daysAbove: days,
        t: temp,
        value: 1
      }
    ];
  }
};
