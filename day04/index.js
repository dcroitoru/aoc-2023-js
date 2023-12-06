import { createRange, getDirName, readInput, sum } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const splitCard = (str) =>
  str
    .split(": ")[1]
    .split(" | ")
    .map((parts) => parts.split(" ").filter((s = "") => s.length));

const solve1 = (input = "") => {
  const rows = input.split("\n");
  const cards = rows.map((row) => {
    // should split card into winning and actual numbers
    const [win, actual] = splitCard(row);
    // should keep only winning numbers
    const matching = actual.filter((num) => win.includes(num));
    // should get length of winning numbers
    const len = matching.length;
    return len;
  });

  // should filter out the 0s and calc power of 2 to len-1
  const points = cards.filter(Boolean).map((v) => Math.pow(2, v - 1));
  const pointsSum = points.reduce(sum);
  return pointsSum;
};
const solve2 = (input = "") => {
  const rows = input.split("\n");
  const cards = rows.map((row) => {
    // should split card into winning and actual numbers
    const [win, actual] = splitCard(row);
    // should keep only winning numbers
    const matching = actual.filter((num) => win.includes(num));
    // should get length of winning numbers
    const len = matching.length;
    return len;
  });

  // should create a pile of card index
  const piles = createRange(0, rows.length - 1).reduce((acc, cur) => {
    return { ...acc, [cur]: 1 };
  }, {});

  const addToPile = (i) => piles[i]++;

  for (let i = 0; i < cards.length; i++) {
    // should create copies (based on card value * multipler) and add to their respective piles
    const multipler = piles[i];
    const copies = cards[i] ? createRange(i + 1, i + cards[i]) : [];
    for (let j = 0; j < multipler; j++) {
      copies.forEach(addToPile);
    }
  }

  const cardsSum = Object.values(piles).reduce(sum);

  return cardsSum;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 23750
console.log("::part2 =>", solve2(input));
// ::part2 => 13261850
