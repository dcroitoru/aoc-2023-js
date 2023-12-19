import { getDirName, readInput } from "../shared/index.js";

const inputFileName = "test-input.txt";
// const inputFileName = "input.txt";
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

const process = (source, target, [x, y], count = 0) => {
  console.log("should process", x, y);

  // if (count >= 500) return;

//   count++;

  const size = source.length - 1;
  const sval = get(source, [x, y]);
  const tval = get(target, [x, y]);

  // right
  if (x < size) {
    const nextPos = [x + 1, y];
    const sr = get(source, nextPos);
    const tr = get(target, nextPos);
    if (canTravelRight(sval, sr) && tr == 0) {
      set(target, nextPos, tval + 1);
      process(source, target, nextPos, count);
    }
  }

  // bottom
  if (y < size) {
    const nextPos = [x, y + 1];
    const sr = get(source, nextPos);
    const tr = get(target, nextPos);
    if (canTravelBottom(sval, sr) && tr == 0) {
      set(target, nextPos, tval + 1);
      process(source, target, nextPos, count);
    }
  }

  // left
  if (x > 0) {
    const nextPos = [x - 1, y];
    const sr = get(source, nextPos);
    const tr = get(target, nextPos);
    if (canTravelLeft(sval, sr) && tr == 0) {
      set(target, nextPos, tval + 1);
      process(source, target, nextPos, count);
    }
  }

  // top
  if (y > 0) {
    const nextPos = [x, y - 1];
    const sr = get(source, nextPos);
    const tr = get(target, nextPos);
    if (canTravelTop(sval, sr) && tr == 0) {
      set(target, nextPos, tval + 1);
      process(source, target, nextPos, count);
    }
  }

  // bottom
};
const directions = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

// const fill = (source, pos, count = 0) => {
//   let queue = [{ pos, count }];

//   while (queue.length > 0) {
//     const current = queue.shift(0);

//     for (let i = 0; i < directions.length; i++) {
//         const newPos =
//       let child = {
//         x: current.x + directions[i][0],
//         y: current.y + directions[i][1],
//         colour,
//       };
//       if (isValidSquare(child.x, child.y, child.colour)) {
//         grid[child.x][child.y] = "#367588";
//         queue.push(child);
//       }
//     }
//   }
// };

// const floodFill = (image, pos, count = 0) => {
//   const size = image.length;
//   const queue = [{ pos, count }];
//   while (queue.length > 0) {
//     const { pos, count } = queue.shift(0);

//     console.log(image, pos, count);
//     const val = get(image, pos);

//     set(image, pos, count);

//     for (const dir of directions) {
//       const x = pos[0] + dir[0];
//       const y = pos[1] + dir[1];
//       if (x < 0 || x >= size || y < 0 || y >= size) continue;
//       queue.push({ pos: [x, y], count: count + 1 });
//     }
//   }
// };

const solve1 = (input = "") => {
  console.log(input);

  const rows = input.split("\n").map((row) => row.split(""));

  const height = rows.length;
  const width = rows[0].length;

  const startPos = getStartPos(rows);
  //   const [x, y] = startPos;

  //   const out = [];
  //   for (let cols = 0; cols < height; cols++) {
  //     out[cols] = [];
  //     for (let rows = 0; rows < width; rows++) {
  //       out[cols][rows] = 0;
  //     }
  //   }

  //   set(out, [x, y], 1);
  //   process(rows, out, startPos, 0);

  floodFill(rows, startPos);

  console.log(rows);
};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 =>
console.log("::part2 =>", solve2(input));
// ::part2 =>
