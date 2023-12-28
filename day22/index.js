import {
  getDirName,
  groupBy,
  readInput,
  Log,
  normalize,
  sum,
} from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const intersect = (a, b) =>
  Math.max(a[0], b[0]) <= Math.min(a[3], b[3]) &&
  Math.max(a[1], b[1]) <= Math.min(a[4], b[4]);

console.log(intersect([0, 2, 3, 2, 2, 3], [0, 0, 2, 2, 0, 2]));

const solve1 = (input = "") => {
  const rows = input.split("\n").map((coords) =>
    coords
      .split("~")
      .map((v) => v.split(",").map((a) => +a))
      .flat()
  );

  // sort by z0
  rows.sort((a, b) => a[2] - b[2]);

  // apply gravity
  rows.forEach((brick, index) => {
    for (let i = index - 1; i >= 0; i--) {
      const other = rows[i];
      if (intersect(brick, other)) {
        brick[5] = brick[5] - brick[2] + other[5] + 1;
        brick[2] = other[5] + 1;
        break;
      }
    }
  });

  // sort again
  rows.sort((a, b) => a[2] - b[2]);

  // create a map of dependencies
  const supports = new Array(rows.length).fill(0).map(() => new Set());
  const supportedBy = new Array(rows.length).fill(0).map(() => new Set());
  rows.forEach((brick, index) => {
    for (let i = index + 1; i < rows.length; i++) {
      const b = rows[i];
      if (b[2] == brick[5] + 1) {
        supports[index].add(i);
        supportedBy[i].add(index);
      }
    }
  });

  const pillars = supports.map((b, i) => {
    
    const otherBricks = [...b];
    const otherBricksSupport = otherBricks.map((k) => [...supportedBy[k]]);
    const ok =
      otherBricksSupport.filter((v) => v.length >= 2).length ==
      otherBricksSupport.length;

    // console.log(brick, otherBricks, otherBricksSupport, ok);
    return ok;
  });

  // console.log(supports);
  // console.log(supportedBy);

  // console.log(pillars);

  return pillars.filter(Boolean).length;
};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 =>
// 1203 too high
console.log("::part2 =>", solve2(input));
// ::part2 =>
