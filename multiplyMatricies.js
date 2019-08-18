module.exports = (a, b) => a.map((row) => row.reduce((arr, _, i) => {
  const res = row.reduce((sum, cell, j) => sum + cell * b[j][i], 0);
  if (isNaN(res)) return arr;
  arr.push(res);
  return arr;
}, []));
