import {
  getDirName,
  groupBy,
  groupCount,
  readInput,
  sum,
} from "../shared/index.js";
import { sortOrder, sortOrderSpecial } from "./cards.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

const sortOrder = "23456789TJQKA";
const sortOrderSpecial = "J23456789TQKA";

const getRank = ([v1, v2]) => {
  if (v1 == 5) return 0;
  if (v1 == 4) return 1;
  if (v1 == 3 && v2 == 2) return 2;
  if (v1 == 3) return 3;
  if (v1 == 2 && v2 == 2) return 4;
  if (v1 == 2) return 5;
  return 6;
};

const getHandType = (hand = "") => {
  const cards = hand.split("");
  const map = cards.reduce(groupCount, {});
  const sortedMap = Object.values(map).sort((a, b) => b - a);
  return getRank(sortedMap);
};

const getHandTypeSpecial = (hand = "") => {
  const cards = hand.split("");
  const map = cards.reduce(groupCount, {});
  const J = map.J || 0;
  delete map.J;

  const sortedMap = Object.values(map).sort((a, b) => b - a);

  // This is the case for 'JJJJJ'
  if (!sortedMap[0]) sortedMap[0] = 0;

  sortedMap[0] += J;
  return getRank(sortedMap);
};

const sortHands = (order) => (a, b) => {
  let i = 0;
  let c1, c2;
  do {
    c1 = a[i];
    c2 = b[i];
    i++;
  } while (c1 == c2);

  return order.indexOf(c2) - order.indexOf(c1);
};

const solve1 = (input = "") => {
  const rows = input.split("\n");

  // create collection of hands and their type
  const hands = rows
    .map((row) => row.split(" "))
    .map(([hand, val]) => [hand, +val, getHandType(hand)]);

  // group hands by type
  const groups = groupBy(hands, ([, , type]) => type);

  // sort groups of hands and then flatten the groups
  const sorted = Object.values(groups)
    .map((group) => group.sort(([c1], [c2]) => sortHands(sortOrder)(c1, c2)))
    .flat();

  // calc winnings based on position
  const maxValue = rows.length;
  const winnings = sorted.map(([, bid], index) => bid * (maxValue - index));

  return winnings.reduce(sum);
};

const solve2 = (input = "") => {
  const rows = input.split("\n");

  // create collection of hands and their type
  const hands = rows
    .map((row) => row.split(" "))
    .map(([hand, val]) => [hand, +val, getHandTypeSpecial(hand)]);

  // group hands by type
  const groups = groupBy(hands, ([, , type]) => type);

  // sort groups of hands and then flatten the groups
  const sorted = Object.values(groups)
    .map((group) =>
      group.sort(([c1], [c2]) => sortHands(sortOrderSpecial)(c1, c2))
    )
    .flat()
    .reverse();

  // calc winnings based on position
  const winnings = sorted.map(([, bid], index) => bid * (index + 1));
  return winnings.reduce(sum);
};

console.log("::part1 =>", solve1(input));
// ::part1 => 250254244

console.log("::part2 =>", solve2(input));
// ::part2 => 250087440
// 250159334 too high
// 249609189 too low
