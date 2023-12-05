import { getDirName, prod, readInput, sum } from "../shared/index.js";

// const inputFileName = "test-input.txt";
// const inputFileName = "test-input2.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const digitsRegex = /[0-9]+/g;
const specialRegex = /[\$\*\#\+\@\&\/\%\=\-]/g;

const createRange = (a, b) =>
  Array.from(Array(Math.abs(a - b) + 1).keys()).map((v) => v + a);

const createWindow = (x0, x1, y0, y1) => {
  const xr = createRange(x0, x1);
  const yr = createRange(y0 + 1, y1 - 1);
  return [
    xr.map((x) => [x, y0]),
    xr.map((x) => [x, y1]),
    yr.map((y) => [x0, y]),
    yr.map((y) => [x1, y]),
  ].flat();
};

const fill =
  (str = "") =>
  (pos) => {
    let x0 = pos;
    let x1 = pos;
    while (x0 >= 0 && !isNaN(str[x0])) x0--;
    while (x1 < str.length && !isNaN(str[x1])) x1++;
    x0 = x0 + 1;
    x1 = x1 - 1;
    const num = str.substring(x0, x1 + 1);

    // console.log("fill", x0, x1, num);

    return num;
  };

const solve1 = (input = "") => {
  const rows = input.split("\n");
  const rowsAsMatrix = rows.map((row) => row.split(""));
  const maxX = rows[0].length - 1;
  const maxY = rows.length - 1;

  const matchedRows = rows.map((row) => [...row.matchAll(digitsRegex)]);
  const norm = matchedRows.map((row, y) =>
    row.map((group) => [
      group[0],
      group.index - 1,
      group.index + group[0].length,
      y - 1,
      y + 1,
    ])
  );

  const windows = norm.flat().map(([id, x0, x1, y0, y1]) => {
    return [
      id,
      createWindow(x0, x1, y0, y1)
        .filter(([x, y]) => 0 <= x && x <= maxX && 0 <= y && y <= maxY)
        .map(([x, y]) => rowsAsMatrix[y][x])
        .join("")
        .match(specialRegex),
    ];
  });

  const filteredNumbers = windows
    .filter(([_, char]) => char !== null)
    .map(([id]) => +id);

  const filteredNumbersSum = filteredNumbers.reduce(sum);

  return filteredNumbersSum;
};

const solve2 = (input = "") => {
  const rows = input.split("\n");
  const maxX = rows[0].length - 1;
  const maxY = rows.length - 1;

  const test = rows
    .map((row, index) => [index, [...row.matchAll(/\*/g)]])
    .filter(([_, matches]) => matches.length > 0);
  const test2 = test
    .map(([y, matches]) => matches.map((match) => [match[0], match.index, y]))
    .flat();

  const gears = test2.map(([char, x, y]) => {
    const window = createWindow(x - 1, x + 1, y - 1, y + 1).filter(
      ([x, y]) => 0 <= x && x <= maxX && 0 <= y && y <= maxY
    );

    // console.log(
    //   char,
    //   window.map(([x, y]) => [x, y, rows[y][x]])
    // );

    const values = window.filter(([x, y]) => !isNaN(rows[y][x]));

    return values;
  });

  const numbers = gears
    .map((values) => [...new Set(values.map(([x, y]) => +fill(rows[y])(x)))])
    .filter((num) => num.length == 2);

  const result = numbers.map((num) => num.reduce(prod, 1)).reduce(sum);
  return result;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 533784
console.log("::part2 =>", solve2(input));
// ::part2 => 78826761
