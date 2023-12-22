import {
  getDirName,
  logMatrix,
  readInput,
  transpose,
} from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const asc = (a, b) => (a == b ? 0 : a < b ? 1 : -1);
const desc = (a, b) => (a == b ? 0 : a > b ? 1 : -1);
const dirSortMap = {
  N: asc,
  W: asc,
  E: desc,
  S: desc,
};
const tilt = (mat = [], dir = "N") => {
  const sortFn = dirSortMap[dir];
  if (dir == "N" || dir == "S") mat = transpose(mat);
  mat = mat.map((col) =>
    col
      .join("")
      .split("#")
      .map((sub) => sub.split("").sort(sortFn).join(""))
      .join("#")
      .split("")
  );
  if (dir == "N" || dir == "S") mat = transpose(mat);
  return mat;
};

const cycle = (mat) => {
  let t = mat;
  t = tilt(t, "N");
  t = tilt(t, "W");
  t = tilt(t, "S");
  t = tilt(t, "E");
  return t;
};

const calcLoad = (rows = []) => {
  const len = rows.length;
  const round = rows
    .map((row) => row.filter((v) => v == "O"))
    .map((row) => row.length);
  const load = round.reduce((acc, cur, ind) => acc + cur * (len - ind), 0);
  return load;
};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));
  const tilted = tilt(rows);
  const load = calcLoad(tilted);
  return load;
};
const solve2 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));
  let t = rows;
  let seed;
  const seeds = [];
  const createSeed = (mat) => mat.map((row) => row.join("")).join("\n");

  // after some couple of cycles, the pattern starts looping
  // find loop start and length
  let loop = false;
  let loopStart = -1;
  while (!loop) {
    t = cycle(t);
    seed = createSeed(t);
    if (seeds.indexOf(seed) > 0) {
      loop = true;
      loopStart = seeds.indexOf(seed);
    } else seeds.push(seed);
  }

  // skip the loops and cycle only for the remainder amount
  const loopLength = seeds.length - loopStart;
  const iter = (1000000000 - (loopStart + 1)) % loopLength;
  for (let i = 0; i < iter; i++) {
    t = cycle(t);
  }

  const load = calcLoad(t);

  return load;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 113486
console.log("::part2 =>", solve2(input));
// ::part2 => 104409
// 104411 too high
// 104403 too low
// 104409
