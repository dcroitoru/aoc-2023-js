import { getDirName, normalize, prod, readInput } from "../shared/index.js";

// const inputFileName = "test-input.txt";
// const inputFileName = "test-input2.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const createModule = (module = "") => {
  const type = module[0];
  const name = type == "b" ? module : module.slice(1);
  const createFn = typeMap[type];
  return createFn(name);
};

const hi = 1;
const lo = 0;
const NOT = (input) => (input ? 0 : 1);

const createBroadcaster = (name = "", outputs = []) => {
  return { type: 0, name, outputs, input: (s) => s, state: () => {} };
};
const createSwitch = (name = "", outputs = []) => {
  let state = 0;
  const input = ([freq]) => {
    if (freq == lo) {
      state = NOT(state);
      return [state, name];
    }
  };

  return { type: 1, name, outputs, input, state: () => state };
};

const createConj = (name = "", outputs = []) => {
  let inputs = {};
  let state = inputs;
  let value;
  const input = ([freq, from]) => {
    state[from] = freq;
    value = Object.values(state).every(Boolean) ? [lo, name] : [hi, name];
    return value;
  };
  return {
    type: 2,
    name,
    inputs,
    input,
    state: () => state,
    value: () => value,
  };
};

const createOutput = () => {
  return { name: "output", input: console.log, state: () => {} };
};

const typeMap = {
  b: createBroadcaster,
  "%": createSwitch,
  "&": createConj,
};

const sendPulse = (circuit, pulse) => {
  const accumulator = [0, 0];
  const q = [pulse];
  while (q.length) {
    const [name, pulse] = q.shift();

    const [freq] = pulse;
    accumulator[freq]++;

    //
    if (!circuit[name]) {
      if (freq == lo) {
        // console.log("output?", name, freq);
        // console.log(accumulator);
      }
      continue;
    }
    // console.log("pulse", pulse);
    // console.log("module before", circuit[name].state());
    const state = circuit[name].input(pulse);
    // console.log("module after", circuit[name].state());
    if (!state) continue;

    const nextModules = circuit[name].outputs.map((n) => [n, state]);
    // nextModules.map((m) => console.log(name, "->", m));

    // console.log("==========");
    q.push(...nextModules);
  }

  return accumulator;
};

const getSwitches = (circuit) => {
  const vals = Object.values(circuit)
    .filter((m) => m.type == 1 && m.state())
    .map((m) => m.name);
  return vals;
};

const getGates = (circuit) => {
  const vals = Object.values(circuit)
    .filter((m) => m.type == 2 && m.state())
    .map((m) => Object.values(m.state()).join(""));
  return vals;
};

const solve1 = (input = "") => {
  const rows = input.split("\n");
  const config = rows
    .map((row) => row.split(" -> "))
    .map(([source, destStr]) => {
      const module = createModule(source);
      const dest = destStr.split(", ");
      module.outputs = dest;

      return module;
    });

  const circuit = normalize(config.map((module) => [module.name, module]));
  config.forEach((m) =>
    m.outputs.forEach((o) => {
      if (circuit[o] && circuit[o].inputs) circuit[o].inputs[m.name] = lo;
    })
  );

  const accumulator = [];
  const mult = 1000;
  for (let i = 0; i < mult; i++) {
    accumulator.push(sendPulse(circuit, ["broadcaster", [lo]]));
  }

  const score = accumulator
    .reduce(([a0, a1], [b0, b1]) => [a0 + b0, a1 + b1], [0, 0])
    .reduce(prod, 1);
  return score;
};
const solve2 = (input = "") => {
  const rows = input.split("\n");
  const config = rows
    .map((row) => row.split(" -> "))
    .map(([source, destStr]) => {
      const module = createModule(source);
      const dest = destStr.split(", ");
      module.outputs = dest;

      return module;
    });

  const circuit = normalize(config.map((module) => [module.name, module]));
  config.forEach((m) =>
    m.outputs.forEach((o) => {
      if (circuit[o] && circuit[o].inputs) circuit[o].inputs[m.name] = lo;
    })
  );

  const accumulator = [];
  const mult = 5;

  for (let i = 0; i < mult; i++) {
    // dp.add(switches);
    const v = sendPulse(circuit, ["broadcaster", [lo]]);

    if (
      circuit.vv.value()[0] == 1 
    //   &&
    //   circuit.nd.value()[0] == 1 &&
    //   circuit.ds.value()[0] == 1
    )
      console.log(i);
    // if (circuit.nd.value() == 0) console.log(i);
    // if (circuit.ds.value() == 0) console.log(i);
    // const gates2 = getGates(circuit);

    // console.log(gates, "=>", gates2, "=>", v);
  }

  //   console.log([...dp].length);
  //   console.log(dp);

  //   console.log(accumulator);

  //   const score = accumulator
  //     .reduce(([a0, a1], [b0, b1]) => [a0 + b0, a1 + b1], [0, 0])
  //     .reduce(prod, 1);
  //   return score;
};

// console.log("::part1 =>", solve1(input));
// ::part1 => 791120136
//  817435498 too high
// 5390000000  too high
console.log("::part2 =>", solve2(input));
// ::part2 =>

// button -low-> broadcaster
// broadcaster -low-> a
// a -high-> inv
// a -high-> con
// inv -low-> b
// con -high-> output
// b -high-> con
// con -low-> output
