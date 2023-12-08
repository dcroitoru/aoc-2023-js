import { chunkify, getDirName, min, readInput } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const createMap = ([dest, source, len]) => [
  [source, source + len],
  dest - source,
];

const createSeedsAndMaps = (str = "") => {
  const rows = str.split("\n\n");
  const seeds = rows[0]
    .split(": ")[1]
    .split(" ")
    .map((n) => +n);

  const maps = rows.slice(1).map((str) =>
    str
      .split(":\n")[1]
      .split("\n")
      .map((mapStr) => mapStr.split(" ").map((n) => +n))
      .map(createMap)
  );

  return [seeds, maps];
};

const transformOne = (key) => (ranges) => {
  const values = ranges
    .filter(([[start, end]]) => start <= key && key < end)
    .map(([_, diff]) => key + diff);
  return values[0] || key;
};

const transformRange = (srcRanges) => (ranges) => {
  let transformed = [];
  let stack = srcRanges;

  ranges.map(([[c, d], diff]) => {
    let newStack = [];
    while (stack.length) {
      let [a, b] = stack.pop();
      const trans = (v) => v + diff;
      const left = [a, Math.min(b, c)];
      const mid = [Math.max(a, c), Math.min(b, d)];
      const right = [Math.max(a, d), b];

      if (left[1] > left[0]) newStack.push(left);
      if (mid[1] > mid[0]) transformed.push(mid.map(trans));
      if (right[1] > right[0]) newStack.push(right);
    }

    stack = newStack;
  });
  return transformed.concat(stack);
};

const solve1 = (input = "") => {
  // should extract seed ids and create all maps
  const [seeds, maps] = createSeedsAndMaps(input);

  // should traverse all maps and return final ids
  const finalIds = seeds.map((seed) =>
    maps.reduce((seed, ranges) => transformOne(seed)(ranges), seed)
  );

  // should pick min id
  const minLoc = min(finalIds);
  return minLoc;
};

const solve2 = (input = "") => {
  // should extract seed ids and create all maps
  const [seeds, maps] = createSeedsAndMaps(input);

  // should create seed ranges
  const seedRanges = chunkify(seeds).map(([start, len]) => [
    start,
    start + len,
  ]);

  // should traverse all maps and return final ids
  const finalIds = seedRanges.map((range) =>
    maps.reduce((src, dst) => transformRange(src)(dst), [range])
  );

  // should pick min id
  const minLoc = min(finalIds.flat().map(([id]) => id));
  return minLoc;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 403695602
console.log("::part2 =>", solve2(input));
// ::part2 => 219529182

// 403695602
// 316511453
// 311335163
// 219529182 ==> correct
