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
  // get potential mirror points - equal consecutive lines
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] == arr[i + 1]) {
      points.push(i + 1);
    }
  }

  // filter out those that are not actually mirrored
  const filtered = points.filter((point) => {
    const minLength = Math.min(point, arr.length - point);
    const left = arr.slice(0, point).reverse().slice(0, minLength);
    const right = arr.slice(point).slice(0, minLength);
    return arraysEqual(left, right);
  });

  return filtered;
};

// returns 0 or more mirror points inside a pattern
const getOtherMirrorPoints = (arr = []) => {
  const len = arr[0].length;
  const points = [];
  const compare = (a, b) => a.map((c, index) => a[index] == b[index]);

  // get potential mirror points - either equal lines or off by 1
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] == arr[i + 1]) {
      points.push(i + 1);
    }

    const a = arr[i];
    const b = arr[i + 1];
    const comp = a
      .split("")
      .map((_, index) => a[index] == b[index])
      .filter(Boolean);

    if (comp.length + 1 == len) points.push(i + 1);
  }

  // get all the points that summed up ar off by 1
  const filtered = points.filter((point) => {
    const minLength = Math.min(point, arr.length - point);
    const left = arr.slice(0, point).reverse().slice(0, minLength);
    const right = arr.slice(point).slice(0, minLength);
    const comp = left
      .map((_, index) =>
        compare(left[index].split(""), right[index]).filter(Boolean)
      )
      .map((v) => v.length)
      .reduce(sum);
    return comp + 1 == minLength * len;
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

const solve2 = (input = "") => {
  const patterns = input.split("\n\n").map((pattern) => pattern.split("\n"));
  const vertical = patterns.map(transposePattern).map(getOtherMirrorPoints);
  const horizontal = patterns.map(getOtherMirrorPoints);
  const left = vertical.flat().reduce(sum, 0);
  const above = horizontal.flat().reduce(sum, 0);
  const ans = above * 100 + left;

  return ans;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 27505
// 25682 too low
console.log("::part2 =>", solve2(input));
// ::part2 => 22906
// 23914 too high
