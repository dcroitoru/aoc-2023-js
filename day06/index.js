import { getDirName, prod, readInput, zip } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const search = (time, dist, dir, count) => {
  if ((time - count) * count > dist) return count;
  return search(time, dist, dir, count + dir);
};

const search2 = (time, dist, dir, startCount) => {
  let count = startCount;
  while ((time - count) * count < dist) {
    count = count + dir;
  }
  return count;
};

// TODO: add binary search
const binarySearch = (time, dist, start, end) => {};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) =>
    row
      .split(":")[1]
      .split(" ")
      .filter(Boolean)
      .map((v) => +v)
  );

  // should create races by zipping time and distance
  const races = zip(rows);

  // should calc margin of error for each race
  const margin = races.map(([time, dist]) => {
    const min = search(time, dist, 1, 0);
    const max = search(time, dist, -1, time);
    return max - min + 1;
  });

  // should return prod of margin
  return margin.reduce(prod, 1);
};
const solve2 = (input = "") => {
  const rows = input
    .split("\n")
    .map((row) => row.split(":")[1].split(" ").join(""))
    .map((v) => +v);

  const time = rows[0];
  const dist = rows[1];
  const min = search2(time, dist, 1, 0);
  const max = search2(time, dist, -1, time);
  const margin = max - min + 1;

  return margin;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 633080
console.log("::part2 =>", solve2(input));
// ::part2 => 20048741
