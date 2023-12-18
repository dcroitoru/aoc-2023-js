import { getDirName, normalize, readInput } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const allTrue = (a, b) => a && b;
const start = (str) => str[2] == "A";
const end = (str) => str[2] == "Z";

const solve1 = (input = "") => {
  const rows = input.split("\n");
  const dir = rows[0].split("").map((c) => (c == "L" ? 0 : 1));
  const map = normalize(
    rows
      .slice(2)
      .map((row) => row.split(" = "))
      .map(([key, value]) => [
        key,
        value.slice(1, value.length - 1).split(", "),
      ])
  );

  let steps = 0;
  let step = "AAA";
  const maxLen = dir.length;

  console.log(maxLen);

  while (step != "ZZZ") {
    const index = steps % maxLen;
    const d = dir[index];
    step = map[step][d];
    steps++;
  }

  return steps;
};
const solve2 = (input = "") => {
  const rows = input.split("\n");
  const dir = rows[0].split("").map((c) => (c == "L" ? 0 : 1));
  const map = normalize(
    rows
      .slice(2)
      .map((row) => row.split(" = "))
      .map(([key, value]) => [
        key,
        value.slice(1, value.length - 1).split(", "),
      ])
  );

  const As = Object.keys(map).filter(start);
  const Zs = Object.keys(map).filter(end);

  console.log(As, Zs);

  let steps = 0;
  let step = As;
  let allZs = (arr) =>
    // arr.map(end).reduce((acc, cur) => {
    //   if (cur === true) return acc + 1;
    //   return acc;
    // }, 0);
    arr.map(end).reduce(allTrue, true);

  //   console.log("all zs", allZs(["BNV", "ZZV", "TNV", "SJV", "GNZ", "NMA"]));

  const maxLen = dir.length;

  const newMap = Object.keys(map).filter((key) => {
    const value = map[key];
    return value.filter(end).length > 0;
  }).map(key => [key, map[key]]);

  console.log(newMap);
  //   map.map(([key, value]) => {})

  //   while (!allZs(step)) {
  //     const index = steps % maxLen;
  //     const d = dir[index];
  //     step = step.map((el) => map[el][d]);
  //     steps++;
  //     console.log(steps, d, step, allZs(step));
  //   }

  return steps;

  console.log(dir, map);
  console.log(As, Zs);
};

console.log("::part1 =>", solve1(input));
// ::part1 =>
// console.log("::part2 =>", solve2(input));
// ::part2 =>
