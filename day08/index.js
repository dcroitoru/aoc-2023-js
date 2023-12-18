import { getDirName, lcmArr, normalize, readInput } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);


const start = (str) => str[2] == "A";
const end = (str) => str[2] == "Z";

const solve1 = (input = "") => {
  const rows = input.split("\n");
  const dir = rows[0].split("").map((c) => (c == "L" ? 0 : 1));
  const map = normalize(
    rows
      .slice(2)
      .map((row) => row.split(" = "))
      .map(([key, value]) => [
        key,
        value.slice(1, value.length - 1).split(", "),
      ])
  );

  let steps = 0;
  let step = "AAA";
  const maxLen = dir.length;
  while (step != "ZZZ") {
    const index = steps % maxLen;
    const d = dir[index];
    step = map[step][d];
    steps++;
  }

  return steps;
};

const solve2 = (input = "") => {
  const rows = input.split("\n");
  const dir = rows[0].split("").map((c) => (c == "L" ? 0 : 1));
  const map = normalize(
    rows
      .slice(2)
      .map((row) => row.split(" = "))
      .map(([key, value]) => [
        key,
        value.slice(1, value.length - 1).split(", "),
      ])
  );

  // Get keys for start nodes
  const As = Object.keys(map).filter(start);

  // Find shortest path for each node till end node
  const shortestPath = As.map((key) => {
    let v = [];
    let step = key;
    while (!end(step)) {
      for (let d in dir) {
        let newStep = map[step][dir[d]];
        v.push(newStep);
        step = newStep;
      }
    }
    return [v.length];
  });

  // Find lowest common multiple between all path lengths
  return lcmArr(shortestPath);
};

console.log("::part1 =>", solve1(input));
// ::part1 => 19099
console.log("::part2 =>", solve2(input));
// ::part2 => 17099847107071
