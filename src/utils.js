export const reevaluateQuantiles = q => {
  console.log(`original: [${q}]`);
  const _min = q[0];
  const _25 = q[1];
  const _50 = q[2];
  const _75 = q[3];
  const _max = q[4];

  if (_min === _25 && _25 === _50 && _50 === _75 && _75 === _max) {
    console.log(`q = max: [${_max}]`);
    return [_max];
  }

  if (_min === _25 && _25 === _50 && _50 === _75) {
    console.log(`q = [50]: [${_50}]`);
    return [_50];
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
    if (d < q[0]) return 4;
    if (d > q[0] && d < q[1]) return 0;
    if (d > q[1] && d < q[2]) return 1;
    if (d > q[2] && d < q[3]) return 2;
    if (d > q[3] && d < q[4]) return 3;
    if (d > q[4]) return 4;
  }

  if (q.length === 4) {
    console.log(`d: ${d}, Qlength: 4`);
    if (d <= q[0]) return 0;
    if (d > q[0] && d < q[1]) return 1;
    if (d === q[1]) return 2;
    if (d > q[1] && d <= q[2]) return 2;
    if (d > q[2]) return 3;
  }

  if (q.length === 3) {
    console.log(`d: ${d}, Qlength: 3`);
    if (d < q[0]) return 0;
    if (d === q[0]) return 1;
    if (d > q[0] && d <= q[1]) return 1;
    if (d > q[1]) return 2;
  }

  if (q.length === 2) {
    console.log(`d: ${d}, Qlength: 2`);
    if (d < q[0]) return 0;
    if (d === q[0]) return 1;
    if (d > q[0]) return 1;
  }

  console.log(`d: ${d}, Qlength: 1`);
  if (q.length === 1) return 0;
};

export const arcMatchColor = d => {
  const { label } = d.data;
  if (label === "New Record") return "#292F36";
  if (label === "Below") return "#0088FE";
  if (label === "Slightly Below") return "#7FB069";
  if (label === "Slightly Above") return "#FFBB28";
  if (label === "Above") return "#E63B2E";
};
