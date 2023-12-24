import {
  getDirName,
  normalize,
  prod,
  readInput,
  sum,
} from "../shared/index.js";

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

// basic idea is to split the interval at the split point
// based on key and comparison symbol;
// send one split part to the next workflow and the rest to the
// next step in current workflow
// when the next step in current workflow is A, the intervals are accepted
// when the next step in current workflow is R, the intervals are discarded
const process2 = (workflows) => (ranges) => {
  const accepted = [];
  const q = [[ranges, "in"]];
  while (q.length) {
    const [val, wf] = q.shift();
    if (wf == "R") continue;
    if (wf == "A") {
      accepted.push(val);
      continue;
    }

    let rest = val;
    const steps = workflows[wf].map((step) => {
      if (step.length == 1) return [rest, step[0]];
      const [key, comp, splitPoint, target] = step;
      const [oldStart, oldEnd] = rest[key];
      const left =
        comp == "<" ? [oldStart, splitPoint - 1] : [oldStart, splitPoint];
      const right =
        comp == "<" ? [splitPoint - 1, oldEnd] : [splitPoint, oldEnd];
      const split = { ...rest, [key]: comp == "<" ? left : right };
      rest = { ...rest, [key]: comp == "<" ? right : left };

      return [split, target];
    });

    q.push(...steps);
  }

  return accepted;
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

  // send all intervals throught the process
  const accepted = process2(workflows)({
    x: [0, 4000],
    m: [0, 4000],
    a: [0, 4000],
    s: [0, 4000],
  });

  const score = accepted
    .map(({ x, m, a, s }) =>
      [x[1] - x[0], m[1] - m[0], a[1] - a[0], s[1] - s[0]].reduce(prod, 1)
    )
    .reduce(sum);

  return score;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 487623
console.log("::part2 =>", solve2(input));
// ::part2 => 113550238315130
