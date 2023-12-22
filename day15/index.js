import { getDirName, readInput, sum } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const hash = (str = "") => {
  let score = 0;
  for (let i = 0; i < str.length; i++) {
    score = ((str.charCodeAt(i) + score) * 17) % 256;
  }

  return score;
};

const solve1 = (input = "") => {
  const seq = input.replace("\n", "").split(",");
  const ans = seq.map(hash).reduce(sum);
  return ans;
};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 => 513214
// 513416 too high
console.log("::part2 =>", solve2(input));
// ::part2 =>
