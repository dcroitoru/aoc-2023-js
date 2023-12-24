import { getDirName, normalize, readInput, sum } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const compareMap = {
  ">": (a, b) => a > b,
  "<": (a, b) => a < b,
};

const process = (workflows) => (part) => {
  let wf;
  let res = "in";

  while (res != "A" && res != "R") {
    wf = workflows[res];
    const next = wf.map((step) => {
      if (step.length == 1) return step;
      const [key, comp, val, target] = step;
      const partVal = part[key];
      const res = compareMap[comp](partVal, val);
      return res ? [target] : [];
    });

    res = next.flat()[0];
  }

  return [part, res];
};

const solve1 = (input = "") => {
  const rows = input.split("\n\n").map((str) => str.split("\n"));

  const workflows = normalize(
    rows[0].map((row) => {
      const [key, valStr] = row.split("{");
      const val = valStr.slice(0, valStr.length - 1).split(",");
      const cond = val.map((c) => c.split(":"));
      const cond2 = cond.map((c) => {
        const [c1, c2] = c;
        if (!c2) return c;

        const cmd = c1[0];
        const comp = c1[1];
        const v = c1.slice(2);

        return [cmd, comp, +v, c2];
      });

      return [key, cond2];
    })
  );

  const parts = rows[1].map((row) =>
    normalize(
      row
        .slice(1, row.length - 1)
        .split(",")
        .map((str) => {
          const key = str[0];
          const val = str.slice(2);
          return [key, +val];
        })
    )
  );

  const processed = parts.map(process(workflows));
  const accepted = processed
    .filter(([_, res]) => res == "A")
    .map(([part]) => part);
  const score = accepted
    .map((obj) => Object.values(obj).reduce(sum))
    .reduce(sum);
  return score;
};
const solve2 = (input = "") => {

    
};

console.log("::part1 =>", solve1(input));
// ::part1 => 487623
console.log("::part2 =>", solve2(input));
// ::part2 =>
