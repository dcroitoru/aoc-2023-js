import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const getDirName = (url) => path.dirname(fileURLToPath(url));

export const readInput = (dirName, fileName = "input.txt") =>
  fs.readFileSync(path.join(dirName, fileName), {
    encoding: "utf-8",
  });

export const sum = (a, b) => a + b;

const createKV = ([key, value]) => ({ [key]: value });

// creates a normalized KV data structure from an array of KV pairs
export const normalize = (rows = []) =>
  rows.reduce((acc, cur) => ({ ...acc, ...createKV(cur) }), {});

// const normTest = [
//   [1, { a: "1" }],
//   [2, { b: 2 }],
// ]; // => { '1': { a: '1' }, '2': { b: 2 } }
// console.log(normalize(normTest));
