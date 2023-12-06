import {
  Log,
  getDirName,
  prod,
  readInput,
  sum,
  withLog,
} from "../shared/index.js";

// const inputFileName = "test-input.txt";
// const inputFileName = "test-input2.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const digitsRegex = /[0-9]+/g;
const specialRegex = /[\*\$\#\+\@\&\/\%\=\-]/;

console.log(specialRegex.test("*"));

const createRange = (a, b) =>
  Array.from(Array(Math.abs(a - b) + 1).keys()).map((v) => v + a);

const createWindow = ([x0, y0, x1, y1]) => {
  const xr = createRange(x0, x1);
  const yr = createRange(y0 + 1, y1 - 1);
  return [
    xr.map((x) => [x, y0]),
    xr.map((x) => [x, y1]),
    yr.map((y) => [x0, y]),
    yr.map((y) => [x1, y]),
  ].flat();
};

// not used
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

const getNumbers = (str, y) =>
  [...str.matchAll(digitsRegex)].map((match) => [match[0], [match.index, y]]);

const getBounds = ([x, y], len) => [x - 1, y - 1, x + len, y + 1];

const filterCoord =
  ([maxX, maxY]) =>
  ([x, y]) =>
    0 <= x && x <= maxX && 0 <= y && y <= maxY;
const getChars = (matrix) => (coords) => coords.map(([x, y]) => matrix[y][x]);
const getCharsWithPos = (matrix) => (coords) =>
  coords.map(([x, y]) => [matrix[y][x], [x, y]]);

const solve1 = (input = "") => {
  const rows = input.split("\n");
  const maxX = rows[0].length - 1;
  const maxY = rows.length - 1;

  // should get all numbers and their indices
  const numbers = rows.map(getNumbers).flat();

  // should get bounds around a number
  const bounds = numbers.map(([num, xy]) => [num, getBounds(xy, num.length)]);

  // should get actual coords along the bounds (windows)
  const windows = bounds.map(([num, bounds]) => [
    num,
    createWindow(bounds).filter(filterCoord([maxX, maxY])),
  ]);

  // should get numbers with special chars
  const numbersWithSpecials = windows
    .map(([num, window]) => [num, getChars(rows)(window).join("")])
    .filter(([_, chars]) => specialRegex.test(chars))
    .map(([num]) => +num);

  const numbersSum = numbersWithSpecials.reduce(sum);
  return numbersSum;
};

const solve2_ = (input = "") => {
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
    const values = window.filter(([x, y]) => !isNaN(rows[y][x]));
    return values;
  });

  const numbers = gears
    .map((values) => [...new Set(values.map(([x, y]) => +fill(rows[y])(x)))])
    .filter((num) => num.length == 2);

  const result = numbers.map((num) => num.reduce(prod, 1)).reduce(sum);
  return result;
};

const solve2 = (input = "") => {
  const rows = input.split("\n");
  const maxX = rows[0].length - 1;
  const maxY = rows.length - 1;

  // should get all numbers and their indices
  const numbers = rows.map(getNumbers).flat();

  // should get bounds around a number
  const bounds = numbers.map(([num, xy]) => [num, getBounds(xy, num.length)]);

  // should get actual coords along the bounds (windows)
  const windows = bounds.map(([num, bounds]) => [
    num,
    createWindow(bounds).filter(filterCoord([maxX, maxY])),
  ]);

  // should get gear positions
  const gearsPos = windows
    .map(([num, window]) => [
      num,
      getCharsWithPos(rows)(window).filter(([char]) => char === "*"),
    ])
    .filter(([_, gears]) => gears.length > 0)
    .map(([num, gears]) => [num, gears.map(([_, pos]) => pos.join("-"))]);

  // should get gear sets
  const gearsSet = gearsPos.reduce((acc, [num, positions = []]) => {
    positions.forEach((pos) => {
      acc[pos] = acc[pos] || [];
      acc[pos].push(num);
    });

    return acc;
  }, {});

  // should filter out gears with 2 numbers
  for (let kv in gearsSet) {
    if (gearsSet[kv].length != 2) {
      delete gearsSet[kv];
    }
  }

  // should calc gear ratio (sum of all products)
  const gearRatio = Object.values(gearsSet)
    .map((numbers) => numbers.map((num) => +num).reduce(prod, 1))
    .reduce(sum);

  return gearRatio;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 533784
console.log("::part2 =>", solve2(input));
// ::part2 => 78826761
