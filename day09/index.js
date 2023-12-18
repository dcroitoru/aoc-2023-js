import {
  dif,
  first,
  getDirName,
  last,
  readInput,
  sum,
} from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const process = (arr = []) => {
  if (arr.reduce(sum) === 0) return [[...arr, 0]];
  let newArr = arr.slice(1).map((val, index) => val - arr[index]);
  return [arr, ...process(newArr)];
};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(" ").map((v) => +v));

  // Extrapolate values
  const processed = rows.map(process);

  // Sum up the last elements
  const lastVal = processed.map((values) => values.map(last).reduce(sum));

  // Sum up the total
  const total = lastVal.reduce(sum);
  return total;
};
const solve2 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(" ").map((v) => +v));

  // Extrapolate values
  const processed = rows.map(process);

  // Dif the first elements in reverse order
  const firstVal = processed.map((values) =>
    values.reverse().map(first).reduce(dif)
  );

  // Sum up the total
  const total = firstVal.reduce(sum);
  return total;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 1479011877
console.log("::part2 =>", solve2(input));
// ::part2 => 973
