import { arraysEqual, getDirName, readInput, sum } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const isValid = (dots = "", blocks = []) => {
  let current = 0;
  let seen = [];
  for (const c of dots) {
    if (c == ".") {
      if (current > 0) {
        seen.push(current);
      }
      current = 0;
    } else if (c == "#") {
      current++;
    }
  }
  if (current > 0) {
    seen.push(current);
  }

  return arraysEqual(seen, blocks);
};

const f = (dots, blocks, i = 0) => {
  if (i == dots.length) {
    if (isValid(dots, blocks)) return 1;
    else return 0;
  }

  if (dots[i] == "?")
    return (
      f(dots.slice(0, i) + "#" + dots.slice(i + 1), blocks, i + 1) +
      f(dots.slice(0, i) + "." + dots.slice(i + 1), blocks, i + 1)
    );
  else return f(dots, blocks, i + 1);
};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => {
    const [dots, blocks] = row.split(" ");
    return [dots, blocks.split(",").map((v) => +v)];
  });

  const arrangements = rows.map(([dots, blocks]) => f(dots, blocks, 0));

  return arrangements.reduce(sum);
};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 => 7361
console.log("::part2 =>", solve2(input));
// ::part2 =>
