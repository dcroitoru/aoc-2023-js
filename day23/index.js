import {
  Log,
  addArr,
  arraysEqual,
  get,
  getDirName,
  max,
  readInput,
} from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const createPath = (map, start, startDir) => {
  const h = map.length;
  const w = map[0].length;
  let len = 0;
  let tail = [[start, startDir]];
  while (tail.length == 1) {
    len++;
    const [[pos, dir]] = tail;
    const [dx, dy] = dir;
    const opDir = [-dx, -dy];
    const nextDirs = dirs.filter((d) => !arraysEqual(d, opDir));
    const nextPoss = nextDirs
      .map((d) => [addArr(pos)(d), d])
      .filter(([[x, y]]) => x >= 0 && x < w && y >= 0 && y < h);
    const nextChars = nextPoss.map(([pos, d]) => [pos, d, get(map, pos)]);
    const filtered = nextChars.filter(([pos, d, char]) => canTravel([d, char]));

    tail = filtered;

    // console.log(tail);
  }

  return [start, tail, len];
};

const dirs = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

const canTravel = ([[x, y], char = ""]) => {
  if (char == ".") return true;
  if (x == 1 && char == ">") return true;
  if (y == 1 && char == "v") return true;
  return false;
};

const createNextDirs = (pos, dir) => dirs.map(addArr(pos));

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));

  const paths = {};
  const start = [1, 0];
  const startDir = [0, 1];
  let q = [[start, startDir]];
  while (q.length) {
    const [pos, dir] = q.shift();
    const path = createPath(rows, pos, dir);
    const [s, e, l] = path;
    if (e.length) e.map(([k]) => (paths[[s, k].join(":")] = l));
    else {
      paths[[s, "end"].join(":")] = l;
    }

    q.push(...e);
  }

  const keys = Object.keys(paths);
  const lens = [];
  q = [["1,0", -1]];
  while (q.length) {
    const [id, len] = q.shift();

    if (id == "end") {
      lens.push(len);
      continue;
    }

    const edges = keys
      .filter((key) => key.startsWith(id))
      .map((key) => {
        const [s, e] = key.split(":");
        return [e, len + paths[key]];
      });
    q.push(...edges);
  }

  console.log(max(lens));
};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 =>
console.log("::part2 =>", solve2(input));
// ::part2 =>
