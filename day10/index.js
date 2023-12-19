import { getDirName, readInput } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const getStartPos = (matrix) => {
  let pos;
  matrix.forEach((rows, y) =>
    rows.forEach((el, x) => {
      if (el == "S") pos = [x, y];
    })
  );

  return pos;
};

const symbols = {
  "-": { L: "SFL-", R: "SJ7-", T: "", B: "" },
  7: { L: "SFL-", R: "", T: "", B: "SJL|" },
  L: { L: "", R: "SJ7-", T: "SF7|", B: "" },
  "|": { L: "", R: "", T: "S7F|", B: "SLJ|" },
  J: { L: "SFL-", R: "", T: "S7F|", B: "" },
  F: { L: "", R: "SJ7-", T: "", B: "SLJ|" },
  S: { L: "FL-", R: "J7-", T: "F7|", B: "LJ|" },
};

const canTravelRight = (el, v) => symbols[el].R.includes(v);
const canTravelLeft = (el, v) => symbols[el].L.includes(v);
const canTravelBottom = (el, v) => symbols[el].B.includes(v);
const canTravelTop = (el, v) => symbols[el].T.includes(v);

// const process =
//   (matrix) =>
//   (newMatrix) =>
//   ([x, y]) =>
//   (steps = 0) => {
//     const size = matrix.length - 1;
//     console.log(x, y);

//     // if (x < 0 || y < 0 || x >= size || y >= size) return;

//     if (steps > 5) return;
//     steps++;

//     const val = matrix[y][x];
//     const nval = newMatrix[y][x];
//     const L = matrix[y][x - 1];
//     const R = matrix[y][newX];
//     const T = matrix[y - 1][x];
//     const B = matrix[newY][x];
//     const NL = newMatrix[y][x - 1];
//     const NR = newMatrix[y][newX];
//     const NT = newMatrix[y - 1][x];
//     const NB = newMatrix[newY][x];

//     console.log("should process::", val, "L:", L, "R:", R);
//     if (val == "." || val == undefined || nval != "x") return;
//     console.log(newMatrix);

//     if (symbols[val].L.includes(L) && NL != "x") {
//       newMatrix[y][x] = NL + 1;
//     }

//     if (symbols[val].R.includes(R) && NR != "x") {
//       newMatrix[y][x] = NR + 1;
//     }

//     if (symbols[val].T.includes(T) && NT != "x") {
//       newMatrix[y][x] = NT + 1;
//     }

//     if (symbols[val].B.includes(B) && NB != "x") {
//       newMatrix[y][x] = NB + 1;
//     }

//     if (val == "S") newMatrix[y][x] = 0;

//     if (newX < size && NR == "x") {
//       process(matrix)(newMatrix)([newX, y])(steps);
//     }
//     if (newY < size && NB == "x") {
//       process(matrix)(newMatrix)([x, newY])(steps);
//     }
//     if (x - 1 > 0 && NL == "x") {
//       process(matrix)(newMatrix)([x - 1, y])(steps);
//     }
//     if (y - 1 > 0 && NT == "x") {
//       process(matrix)(newMatrix)([x, y - 1])(steps);
//     }
//   };

const get = (mat, [x, y]) => mat[y][x];
const set = (mat, [x, y], val) => {
  mat[y][x] = val;
  //   console.log(mat);
};

const process = (source, startPos, count = 0) => {
  const size = source.length - 1;
  let maxCount = 0;
  //   const sval = get(source, [x, y]);

  const queue = [[startPos, count]];

  while (queue.length > 0) {
    const [pos, count] = queue.shift(0);
    const [x, y] = pos;
    const sval = get(source, pos);
    if (count > maxCount) maxCount = count;

    if (typeof sval == "number") continue;

    set(source, pos, count);
    // right
    if (x < size) {
      const nextPos = [x + 1, y];
      const sr = get(source, nextPos);
      if (canTravelRight(sval, sr)) {
        queue.push([nextPos, count + 1]);
      }
    }

    // bottom
    if (y < size) {
      const nextPos = [x, y + 1];
      const sr = get(source, nextPos);
      if (canTravelBottom(sval, sr)) {
        queue.push([nextPos, count + 1]);
      }
    }

    // left
    if (x > 0) {
      const nextPos = [x - 1, y];
      const sr = get(source, nextPos);
      if (canTravelLeft(sval, sr)) {
        queue.push([nextPos, count + 1]);
      }
    }

    // top
    if (y > 0) {
      const nextPos = [x, y - 1];
      const sr = get(source, nextPos);
      if (canTravelTop(sval, sr)) {
        queue.push([nextPos, count + 1]);
      }
    }
  }

  console.log(maxCount);
};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));
  const startPos = getStartPos(rows);

  process(rows, startPos);
};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 => 6815
console.log("::part2 =>", solve2(input));
// ::part2 =>
