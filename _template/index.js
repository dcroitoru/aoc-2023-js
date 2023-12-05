import { getDirName, readInput } from "../shared/index.js";

const inputFileName = "test-input.txt";
// const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const solve1 = (input = "") => {};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 =>
console.log("::part2 =>", solve2(input));
// ::part2 =>
