import { get, getDirName, readInput } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const dirs = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];
const solve1 = (input = "") => {
  const rows = input.split("\n");

  const start = [rows[0].length, rows.length].map((v) => Math.floor(v / 2));
  let gardens = [start.join("-")];

  const steps = 64;
  for (let i = 0; i < steps; i++) {
    const newGardens = new Set();
    gardens.forEach((pos) => {
      dirs.forEach(([s, t]) => {
        const [x, y] = pos.split("-");
        const coord = [+x + s, +y + t];

        if (newGardens.has(coord.join("-"))) return;
        if (get(rows, coord) == ".") newGardens.add(coord.join("-"));
      });
    });

    gardens = [...newGardens];
  }

  const score = [...new Set(gardens)].length + 1;
  return score;
};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 =>
console.log("::part2 =>", solve2(input));
// ::part2 =>
