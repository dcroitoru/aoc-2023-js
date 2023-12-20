import {
  createPairs,
  getDirName,
  readInput,
  sum,
} from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

function transpose(matrix) {
  return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

const createGalaxies = (mat) =>
  mat
    .map((row, y) =>
      row.map((cell, x) => (cell == "#" ? [x, y].join("-") : cell))
    )
    .flat()
    .filter((el) => el != ".");

const createDistances = (pairs, emptyRows, emptyColumns, multiplier = 2) =>
  pairs.map(([a, b]) => {
    const [x1, y1] = a.split("-");
    const [x2, y2] = b.split("-");
    const expandCols = emptyColumns.filter(
      (v) => (x1 < v && v < x2) || (x1 > v && v > x2)
    );
    const expandRows = emptyRows.filter(
      (v) => (y1 < v && v < y2) || (y1 > v && v > y2)
    );

    return (
      Math.abs(x1 - x2) +
      Math.abs(y1 - y2) +
      expandCols.length * (multiplier - 1) +
      expandRows.length * (multiplier - 1)
    );
  });

const calcTotalDistance = (rows, multiplier = 2) => {
  const cols = transpose(rows);
  const galaxyIndex = (row, i) => (row.indexOf("#") == -1 ? i : null);
  const emptyRows = rows.map(galaxyIndex).filter(Boolean);
  const emptyColumns = cols.map(galaxyIndex).filter(Boolean);
  const galaxies = createGalaxies(rows);
  const pairs = createPairs(galaxies);
  const distances = createDistances(pairs, emptyRows, emptyColumns, multiplier);
  return distances.reduce(sum);
};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));
  return calcTotalDistance(rows);
};
const solve2 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));
  return calcTotalDistance(rows, 1000000);
};

console.log("::part1 =>", solve1(input));
// ::part1 => 9521550
console.log("::part2 =>", solve2(input));
// ::part2 => 298932923702
