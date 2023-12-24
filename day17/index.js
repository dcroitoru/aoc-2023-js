import { addArr, delay, getDirName, readInput } from "../shared/index.js";

const inputFileName = "test-input.txt";
// const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);
const e = [1, 0];
const s = [0, 1];
const w = [-1, 0];
const n = [0, -1];
const dirMap = { e, s, w, n };
const dirComplement = {
  e: "w",
  w: "e",
  s: "n",
  n: "s",
};
const dirs = ["e", "s", "w", "n"];

// function dijkstraAlgorithm(graph) {
//     const costs = Object.assign({end: Infinity}, graph.start);
//     const parents = {end: null};
//     const processed = [];

//     let node = findLowestCostNode(costs, processed);

//     while (node) {
//         let cost = costs[node];
//         let children = graph[node];
//         for (let n in children) {
//             let newCost = cost + children[n];
//             if (!costs[n] || costs[n] > newCost) {
//                 costs[n] = newCost;
//                 parents[n] = node;
//             }
//         }
//         processed.push(node);
//         node = findLowestCostNode(costs, processed);
//     }

//     let optimalPath = ['end'];
//     let parent = parents.end;
//     while (parent) {
//         optimalPath.push(parent);
//         parent = parents[parent];
//     }
//     optimalPath.reverse();

//     return {distance: costs.end, path: optimalPath};
// };

// function findLowestCostNode(costs, processed) {
//     return Object.keys(costs).reduce((lowest, node) => {
//         if (lowest === null || costs[node] < costs[lowest]) {
//             if (!processed.includes(node)) {
//                 lowest = node;
//             }
//         }
//         return lowest;
//     }, null);
// };

const createGraph = async (mat) => {
  const h = mat.length;
  const w = mat[0].length;
  const start = [0, 0];
  const createId = (pos) => pos.join(",");
  const createPos = (id) => id.split(",").map((v) => +v);
  const encode = ([pos, dir]) => createId(pos) + ":" + dir;
  const decode = (str = "") => {
    const [id, dirs] = str.split(":");
    return [createPos(id), dirs];
  };

  const graph = {};
  const seen = [];
  const q = [encode([start, ""])];

  while (q.length > 0) {
    const nodeId = q.shift();

    if (seen.includes(nodeId)) continue;

    

    const [pos, path] = decode(nodeId);

    // console.log(pos, path);

    const newNodeIds = dirs
      .filter((d) => d != dirComplement[path[path.length - 1]])
      .filter((d) => {
        const p = d + path;
        return p != "eeee" && p != "ssss" && p != "wwww" && p != "nnnn";
      })
      .map((dir) => {
        let newPath = path + dir;
        newPath.length > 3 && (newPath = newPath.slice(1));
        const newId = addArr(pos)(dirMap[dir]);
        return [newId, newPath];
      })
      .filter(([[x, y]]) => x >= 0 && x < w && y >= 0 && y < h)
      .map(encode);

    if (newNodeIds.length == 0) continue;

    graph[nodeId] = newNodeIds;


    console.clear()
    console.log(nodeId);
    console.log(newNodeIds);
    await delay(250)

    q.push(...newNodeIds);
  }

  console.log(graph);

  //   const createNode = (id) => {
  //     const [posStr, dirs] = id.split(":");
  //     const pos = createPos(posStr);
  //   };

  // .filter(
  //   ([x, y]) => x >= 0 && y >= 0
  // );
};

const solve1 = (input = "") => {
  const rows = input.split("\n").map((row) => row.split(""));
  createGraph(rows);
};
const solve2 = (input = "") => {};

console.log("::part1 =>", solve1(input));
// ::part1 =>
console.log("::part2 =>", solve2(input));
// ::part2 =>
