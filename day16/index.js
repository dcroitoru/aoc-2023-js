import {
  createMatrix,
  createRange,
  createRangeLen,
  delay,
  get,
  getDirName,
  logMatrix,
  readInput,
  set,
  sum,
} from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const map = {
  ".": ([x, y]) => [[x, y]],
  "\\": ([x, y]) => [[y, x]],
  "/": ([x, y]) => [[-y, -x]],
  "|": ([x, y]) =>
    x
      ? [
          [0, 1],
          [0, -1],
        ]
      : [[x, y]],
  "-": ([x, y]) =>
    y
      ? [
          [1, 0],
          [-1, 0],
        ]
      : [[x, y]],
};

const beam = (mat = [], p = [0, 0], d = [1, 0], visited) => {
  const h = mat.length;
  const w = mat[0].length;
  const queue = [[p, d]];

  while (queue.length > 0) {
    const [pos, dir] = queue.shift();
    let [x, y] = pos;

    // if beam is outside, continue
    if (x < 0 || x >= w || y < 0 || y >= h) continue;

    let char = get(mat, pos);
    const v = get(visited, pos);
    const id = "[" + dir.join(":") + "]";

    // if beam already visited cell from current dir, continue
    if (v != "0" && v.includes(id)) continue;

    // beam did not visit current cell from dir, add it to cell
    set(visited, pos, v + id);

    // split into 2 beams or step into the next cell
    const step = map[char](dir);
    if (step.length == 2) {
      const [[s1, t1], [s2, t2]] = step;
      queue.push([[x + s1, y + t1], step[0]]);
      queue.push([[x + s2, y + t2], step[1]]);
    } else {
      const [s, t] = step[0];
      queue.push([[x + s, y + t], step[0]]);
    }
  }
};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));
  const h = rows.length;
  const w = rows[0].length;

  const visited = createMatrix(w, h, "0");
  beam(rows, [0, 0], [1, 0], visited);
  const score = visited
    .map((row) => row.filter((v) => v != "0").length)
    .reduce(sum);

  return score;
};
const solve2 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));
  const h = rows.length;
  const w = rows[0].length;

  const hor = createRangeLen(0, w);
  const vert = createRangeLen(0, h);
  const top = hor.map((x) => [x, 0]);
  const bot = hor.map((x) => [x, h - 1]);
  const left = vert.map((y) => [0, y]);
  const right = vert.map((y) => [w - 1, y]);
  const combinations = [
    [top, [0, 1]], // ^
    [bot, [0, -1]], // v
    [left, [1, 0]], // >
    [right, [-1, 0]], // <
  ];
  let max = 0;
  const scores = combinations.map(([posArr, dir]) =>
    posArr.map((pos) => {
      const visited = createMatrix(w, h, "0");
      beam(rows, pos, dir, visited);
      const score = visited
        .map((row) => row.filter((v) => v != "0").length)
        .reduce(sum);

      if (score > max) max = score;

      return score;
    })
  );

  return max;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 7496
console.log("::part2 =>", solve2(input));
// ::part2 => 7932
