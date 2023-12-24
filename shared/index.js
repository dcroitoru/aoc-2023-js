import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getDirName = (url) => path.dirname(fileURLToPath(url));

export const readInput = (dirName, fileName = "input.txt") =>
  fs.readFileSync(path.join(dirName, fileName), {
    encoding: "utf-8",
  });

export const dif = (a, b) => b - a;
export const sum = (a, b) => a + b;
export const prod = (a, b) => a * b;
export const clamp = (val, min, max) =>
  val < min ? min : val > max ? max : val;

const createKV = ([key, value]) => ({ [key]: value });

// creates a normalized KV data structure from an array of KV pairs
export const normalize = (rows = []) =>
  rows.reduce((acc, cur) => ({ ...acc, ...createKV(cur) }), {});

export const withLog =
  (fn) =>
  (...rest) => {
    const ret = fn(...rest);
    console.log(rest[0], rest[1] || "", "=>", ret);
    return ret;
  };

export const Log = (val) => console.dir(val, { depth: null });

export const createRange = (a, b) =>
  Array.from(Array(Math.abs(a - b) + 1).keys()).map((v) => v + a);
export const createRangeLen = (start, len) =>
  Array.from(Array(len).keys()).map((v) => v + start);

export const first = (arr) => arr[0];
export const last = (arr) => arr[arr.length - 1];

export const compareBigInt = (a, b) => {
  if (a.length == b.length) {
    return a < b ? -1 : a > b ? 1 : 0;
  } else if (a.length < b.length) {
    return -1;
  } else {
    return 1;
  }
};

export const min = (arr = []) => {
  let min;
  arr.forEach((el) => {
    if (!min || min > el) {
      min = el;
    }
  });

  return min;
};

export const max = (arr = []) => Math.max.apply(Math, arr);

export const chunkify = (arr, chunkSize = 2) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
};

export const zip = (rows) => rows[0].map((_, c) => rows.map((row) => row[c]));

export const groupBy = (arr = [], fn) =>
  arr.reduce((acc, cur) => {
    const field = fn(cur);
    const val = acc[field] || [];
    return { ...acc, [field]: [...val, cur] };
  }, {});
export const groupCount = (acc, cur) => {
  const val = acc[cur] || 0;
  return { ...acc, [cur]: val + 1 };
};

const gcd = (a, b) => (b == 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a / gcd(a, b)) * b;
export const lcmArr = (ns) => ns.reduce(lcm, 1);

export const logMatrix = (matrix) =>
  console.log(matrix.map((row) => row.join("")).join("\n"));

export const createPairs = (list) =>
  list.reduce(
    (acc, item, i, arr) =>
      acc.concat(arr.slice(i + 1).map((_item) => [item, _item])),

    []
  );

export const arraysEqual = (a, b) =>
  a.length === b.length && a.every((element, index) => element === b[index]);

const factorial = (n) => (n == 0 ? 1 : n * factorial(n - 1));
const arrangements = (n, k) => factorial(n) / factorial(n - k);

export const transpose = (matrix) =>
  matrix[0].map((_, i) => matrix.map((row) => row[i]));

export const get = (mat, [x, y]) => mat[y][x];
export const set = (mat, [x, y], val) => (mat[y][x] = val);
export const delay = (time) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const createMatrix = (w, h, fillWith) =>
  new Array(h).fill("").map(() => new Array(w).fill(fillWith));

export const addArr = (a) => (b) => a.map((_, i) => a[i] + b[i]);
