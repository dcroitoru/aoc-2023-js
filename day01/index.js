import { getDirName, readInput, sum } from "../shared/index.js";

const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, "input.txt");

const numbers = (str = "") => str.split("").filter((a) => parseInt(a));
const calibrationNum = (arr) => arr[0] + arr[arr.length - 1];

const numbersMap = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
};

// lookbehind regex
const numbersRegex = /(?<=(one|two|three|four|five|six|seven|eight|nine|\d))/gi;
const numbers2 = (str = "") =>
  [...str.matchAll(numbersRegex)]
    // pick from capturing group
    .map((s) => s[1])
    .map((s) => numbersMap[s] || s);

const solve1 = (input = "") => {
  const rows = input.trim().split("\n");
  const calibration = rows
    .map(numbers)
    .map(calibrationNum)
    .map((a) => parseInt(a))
    .filter(Boolean);

  const calibrationSum = calibration.reduce(sum, 0);
  return calibrationSum;
};

const solve2 = (input = "") => {
  const rows = input.trim().split("\n");
  const calibration = rows
    .map(numbers2)
    .map(calibrationNum)
    .map((a) => parseInt(a))
    .filter(Boolean);

  const calibrationSum = calibration.reduce(sum, 0);
  return calibrationSum;
};

console.log("::part1 =>", solve1(input));
console.log("::part2 =>", solve2(input));
// ::part1 => 56397
// ::part2 => 55701
