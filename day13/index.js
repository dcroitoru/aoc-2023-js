import {
  arraysEqual,
  getDirName,
  readInput,
  sum,
  transpose,
} from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

// returns 0 or more mirror points inside a pattern
const getMirrorPoints = (arr = []) => {
  const points = [];
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] == arr[i + 1]) {
      points.push(i + 1);
    }
  }

  const filtered = points.filter((point) => {
    const minLength = Math.min(point, arr.length - point);
    const left = arr.slice(0, point).reverse().slice(0, minLength);
    const right = arr.slice(point).slice(0, minLength);
    return arraysEqual(left, right);
  });

  return filtered;
};

const transposePattern = (pattern = []) => {
  return transpose(pattern.map((row) => row.split(""))).map((col) =>
    col.join("")
  );
};

const solve1 = (input = "") => {
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));
  const vertical = patterns.map(transposePattern).map(getMirrorPoints);
  const horizontal = patterns.map(getMirrorPoints);
  const left = vertical.flat().reduce(sum, 0);
  const above = horizontal.flat().reduce(sum, 0);
  const ans = above * 100 + left;
  return ans;
};

const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 => 27505
// 25682 too low
console.log("::part2 =>", solve2(input));
// ::part2 =>
