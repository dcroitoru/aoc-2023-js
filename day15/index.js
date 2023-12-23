import { getDirName, normalize, readInput, sum } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const hash = (str = "") => {
  let score = 0;
  for (let i = 0; i < str.length; i++) {
    score = ((str.charCodeAt(i) + score) * 17) % 256;
  }

  return score;
};

const solve1 = (input = "") => {
  const seq = input.replace("\n", "").split(",");
  const ans = seq.map(hash).reduce(sum);
  return ans;
};
const solve2 = (input = "") => {
  const items = input.replace("\n", "").split(",");
  const sequence = items.map((el) =>
    el.includes("-") ? el.split("-") : el.split("=")
  );

  const labelToBoxMap = normalize(sequence.map(([id]) => [id, hash(id)]));
  const boxes = normalize(
    new Array(256).fill("").map((_, id) => [id, { keys: [], kvs: {} }])
  );

  sequence.forEach(([label, lens]) => {
    const boxId = labelToBoxMap[label];
    const box = boxes[boxId];
    const { keys, kvs } = box;
    const labelIndex = keys.indexOf(label);

    if (lens) {
      if (labelIndex == -1) {
        keys.push(label);
      }
      kvs[label] = lens;
    } else {
      if (labelIndex != -1) {
        keys.splice(labelIndex, 1);
        delete kvs[label];
      }
    }
  });

  const ans = Object.values(boxes)
    .map((box, boxIndex) => {
      const { keys, kvs } = box;
      return keys.map(
        (key, labelIndex) => (boxIndex + 1) * (labelIndex + 1) * kvs[key]
      );
    })
    .flat()
    .reduce(sum);
  return ans;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 513214
// 513416 too high
console.log("::part2 =>", solve2(input));
// ::part2 => 258826
