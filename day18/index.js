import {
  createMatrix,
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
  R: [1, 0],
  L: [-1, 0],
  D: [0, 1],
  U: [0, -1],
};

const map2 = ["R", "D", "L", "U"];

const getSize = (commands) => {
  let minx = 0;
  let maxx = 0;
  let miny = 0;
  let maxy = 0;
  let x = 1;
  let y = 1;
  commands.forEach(([cmd, dist]) => {
    const [dx, dy] = map[cmd];
    x += dx * dist;
    y += dy * dist;

    maxx = Math.max(x, maxx);
    minx = Math.min(x, minx);
    maxy = Math.max(y, maxy);
    miny = Math.min(y, miny);
  });

  const offset = [minx, miny].map((v) => Math.abs(v) + 1);
  const w = maxx + offset[0] + 2;
  const h = maxy + offset[1] + 2;

  return [offset, [w, h]];
};

const digEdges = (commands, mat, [startX, startY]) => {
  let x = startX;
  let y = startY;
  commands.forEach(([dir, dist]) => {
    for (let i = 0; i < dist; i++) {
      const [dx, dy] = map[dir];
      x += dx;
      y += dy;
      mat[y][x] = "#";
    }
  });
};

const floodFill = async (image, startPos, color = "x", edge = ["*"]) => {
  const h = image.length;
  const w = image[0].length;
  const queue = [startPos];
  const dirMap = map;

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

const empty = ".";
const expand = (mat = []) => {
  const w = mat[0].length + 2;
  const row = new Array(w).fill(empty);
  return [row, ...mat.map((row) => [empty, ...row, empty]), row];
};

const contract = (mat = []) => {
  const h = mat.length - 1;
  const w = mat[0].length - 1;
  return mat.slice(1, h).map((row) => row.slice(1, w));
};

const createPolygon = (commands, [x0, y0]) => {
  let x = x0;
  let y = y0;
  let poly = [];
  commands.forEach(([dir, dist]) => {
    const [dx, dy] = map[dir];

    x += dx * dist;
    y += dy * dist;
    console.log(dir, dist, [x, y]);
    poly.push([x, y]);
  });

  return poly;
};

const calcPerim = (poly) => {
  const len = poly.length;
  let P = 0;
  for (let i = 0; i < len; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % len];
    P += x1 == x2 ? Math.abs(y1 - y2) : Math.abs(x1 - x2);
  }
  return P;
};

const calcArea = (poly) => {
  const len = poly.length;
  let A = 0;
  for (let i = 0; i < len; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % len];
    A += x1 * y2 - x2 * y1;
  }
  A = 0.5 * Math.abs(A);
  return A;
};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(" "));
  const commands = rows.map(([dir, dist]) => [dir, +dist]);
  const [offset, [w, h]] = getSize(commands);

  const mat = createMatrix(w, h, empty);

  digEdges(commands, mat, offset);
  const expanded = expand(mat);
  floodFill(expanded, [0, 0], "x", "#");
  const contracted = contract(expanded);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      floodFill(contracted, [i, j], "#", "x");
    }
  }

  const score = contracted
    .map((row) => row.filter((v) => v == "#").length)
    .reduce(sum);

  //   logMatrix(contracted);
  console.log(score);
  return score;
};

const solve2 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(" ")[2].slice(1, 8));

  const commands = rows.map((row) => {
    const dir = row[6];
    const dist = row.slice(1, 6);
    return [map2[dir], parseInt(dist, 16)];
  });

  const poly = createPolygon(commands, [0, 0]);
  const peri = calcPerim(poly);
  const area = calcArea(poly);

  return area + peri / 2 + 1;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 70026
console.log("::part2 =>", solve2(input));
// ::part2 => 68548301037382
