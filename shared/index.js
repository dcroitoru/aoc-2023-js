import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getDirName = (url) => path.dirname(fileURLToPath(url));

export const readInput = (dirName, fileName = "input.txt") =>
  fs.readFileSync(path.join(dirName, fileName), {
    encoding: "utf-8",
  });

export const sum = (a, b) => a + b;
export const prod = (a, b) => a * b;
export const clamp = (val, min, max) =>
  val < min ? min : val > max ? max : val;

const createKV = ([key, value]) => ({ [key]: value });

// creates a normalized KV data structure from an array of KV pairs
export const normalize = (rows = []) =>
  rows.reduce((acc, cur) => ({ ...acc, ...createKV(cur) }), {});

// const normTest = [
//   [1, { a: "1" }],
//   [2, { b: 2 }],
// ]; // => { '1': { a: '1' }, '2': { b: 2 } }
// console.log(normalize(normTest));

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

export const chunkify = (arr, chunkSize = 2) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
};
