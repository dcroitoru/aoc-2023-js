import { getDirName, readInput } from "../shared/index.js";

const inputFileName = "input.txt";
// const inputFileName = "test-input.txt";
// const inputFileName = "test-input2.txt";
// const inputFileName = "test-input3.txt";
// const inputFileName = "test-input4.txt";
// const inputFileName = "test-input5.txt";
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

const canConnectFrom = {
  R: "-7JS",
  L: "-FLS",
  T: "|7FS",
  B: "|JLS",
};

const dirMap = {
  R: [1, 0], // right
  L: [-1, 0], // left
  B: [0, 1], // bottom
  T: [0, -1], // top
};

const dirSymbolMap = {
  "-": ["R", "L"],
  "|": ["T", "B"],
  7: ["L", "B"],
  F: ["R", "B"],
  L: ["R", "T"],
  J: ["L", "T"],
  S: ["R", "B", "L", "T"],
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

  const queue = [[startPos, count]];

  while (queue.length > 0) {
    const [pos, count] = queue.shift(0);
    const [x, y] = pos;
    const sval = get(source, pos);
    if (count > maxCount) maxCount = count;

    if (sval === "*") continue;

    // console.log(source.map((row) => row.join("")).join("\n"));

    set(source, pos, "*");
    // right
    if (x < size) {
      const nextPos = [x + 1, y];
      const sr = get(source, nextPos);

      //   console.log(sval, sr, canTravelRight(sval, sr));

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

  return maxCount;
};

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

const floodFillPipes = async (image, startPos, color = "*") => {
  const h = image.length;
  const w = image[0].length;
  const queue = [startPos];

  while (queue.length > 0) {
    const pos = queue.shift();
    const [x, y] = pos;
    const old = get(image, pos);

    if (old === ".") continue;
    if (old === color) continue;

    set(image, pos, color);

    const dirs = dirSymbolMap[old];
    for (let dir of dirs) {
      const newPos = [x + dirMap[dir][0], y + dirMap[dir][1]];
      const [xx, yy] = newPos;
      if (xx < 0 || xx >= w || yy < 0 || yy >= h) {
        continue;
      }

      const newVal = get(image, newPos);
      if (!canConnectFrom[dir].includes(newVal)) {
        continue;
      }

      queue.push(newPos);
    }

    // await delay(50);

    // console.log("queue.length", queue.length);
    // console.clear();
    // console.log(image.map((row) => row.join("")).join("\n"));
  }

  //   console.log(image.map((row) => row.join("")).join("\n"));
  return image;
};

const floodFill = async (image, startPos, color = "x", edge = ["*"]) => {
  const h = image.length;
  const w = image[0].length;
  const queue = [startPos];

  while (queue.length > 0) {
    const pos = queue.shift();
    const [x, y] = pos;
    const old = get(image, pos);

    if (old === color) continue;
    if (edge.includes(old)) continue;

    set(image, pos, color);

    for (let dir of Object.keys(dirMap)) {
      const newPos = [x + dirMap[dir][0], y + dirMap[dir][1]];
      const [xx, yy] = newPos;
      if (xx < 0 || xx >= w || yy < 0 || yy >= h) {
        continue;
      }
      queue.push(newPos);
    }

    // await delay(20);

    // console.log("queue.length", queue.length);
    // console.clear();
    // console.log(image.map((row) => row.join("")).join("\n"));
  }

  //   console.log(image.map((row) => row.join("")).join("\n"));
  return image;
};

const expandPipes = (image = []) => {
  const cols = image.length;
  const rows = image[0].length;

  const newImage = image.map((row) => {
    const newRow = row
      .map((cell, i) => (i == 0 ? ["_", cell, "_"] : [cell, "_"]))
      .flat();

    const newNewRow = newRow.map((cell, i) => {
      if (i > 0 && i < newRow.length - 1) {
        const l = newRow[i - 1];
        const r = newRow[i + 1];
        if (canConnectFrom.L.includes(l) && canConnectFrom.R.includes(r))
          return "-";
      }

      return cell;
    });

    return newNewRow.map((cell) => (cell == "_" ? "." : cell));
  });

  const newNewImage = newImage
    .map((row, i) => {
      const newRow = new Array(row.length).fill("_");
      if (i == 0) return [newRow, row, newRow];
      return [row, newRow];
    })
    .flat();
  const newNewNewImage = newNewImage
    .map((row, y) => {
      if (y > 0 && y < newNewImage.length - 1 && y % 2 == 0) {
        return row.map((cell, x) => {
          const t = get(newNewImage, [x, y - 1]);
          const b = get(newNewImage, [x, y + 1]);
          if (canConnectFrom.T.includes(t) && canConnectFrom.B.includes(b))
            return "|";
          return cell;
        });
      }
      return row;
    })
    .map((row) => row.map((cell) => (cell == "_" ? "." : cell)));

  return newNewNewImage;
};

const solve1 = async (input = "") => {
  // TODO: redo solution for part1 (lost in commits)
};

const solve2 = async (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));

  // expand pipes
  const image = expandPipes(rows);
  const startPos = getStartPos(image);

  // console.log("image", image);
  //   console.log(image.map((row) => row.join("")).join("\n"));

  await floodFillPipes(image, startPos);
  await floodFill(image, [0, 0], "x", ["*"]);

  for (let col in image) {
    for (let row in image[col]) {
      const pos = [+row, +col];
      await floodFill(image, pos, "o", ["*", "x"]);
    }
  }

  //   console.log("\n\n==============================================");
  //   console.log(image.map((row) => row.join("")).join("\n"));

  const even = (_, i) => i % 2 == 0;
  const odd = (_, i) => i % 2 == 1;

  //   console.log("\n\n==============================================");
  //   console.log(
  //     image
  //       .filter(odd)
  //       .map((row) => row.filter(odd).join(""))
  //       .join("\n")
  //   );

  const count = image
    .filter(odd)
    .map((row) => row.filter(odd).filter((cell) => cell == "o"))
    .flat()
    .join("").length;

  return count;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 6815
console.log("::part2 =>", await solve2(input));
// ::part2 => 269
