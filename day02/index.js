import { getDirName, normalize, readInput, sum } from "../shared/index.js";

// const inputFileName = "test-input.txt";
const inputFileName = "input.txt";
const __dirname = getDirName(import.meta.url);
const input = readInput(__dirname, inputFileName);

// ex: '3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green'
const createRolls = (str = "") => {
  const rolls = str
    .split(", ")
    .map((s) => s.split(" ").reverse())
    .map(([col, val]) => [col, +val]);

  const dice = normalize(rolls);
  return dice;
};

// ex: 'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green',
const createGame = (str = "") => {
  const [gameStr, matchesStr] = str.split(": ");
  const id = gameStr.substring("Game ".length);
  const matches = matchesStr.split("; ").map(createRolls);
  return [id, matches];
};

const rollValid =
  ({ red, green, blue }) =>
  (roll) => {
    if (roll?.red > red) return false;
    if (roll?.green > green) return false;
    if (roll?.blue > blue) return false;

    return true;
  };

const maxRoll = (a, b) => ({
  red: Math.max(a.red || 0, b.red || 0),
  green: Math.max(a.green || 0, b.green || 0),
  blue: Math.max(a.blue || 0, b.blue || 0),
});

const rollProduce = ({ red, green, blue }) => red * green * blue;

const solve1 = (input = "") => {
  const rule = { red: 12, green: 13, blue: 14 };
  const rows = input.split("\n");
  const games = rows.map(createGame);

  const gamesMaxRoll = games.map(([id, rolls]) => [id, rolls.reduce(maxRoll)]);
  const validGames = gamesMaxRoll.map(([id, maxRoll]) => [
    id,
    rollValid(rule)(maxRoll),
  ]);
  const validGameIds = validGames
    .filter(([_, valid]) => valid)
    .map(([id]) => +id);
  const validGameIdsSum = validGameIds.reduce(sum, 0);

  return validGameIdsSum;
};

const solve2 = (input = "") => {
  const rows = input.split("\n");
  const games = rows.map(createGame);

  const gamesMaxRoll = games.map(([_, rolls]) => rolls.reduce(maxRoll));
  const gamesPower = gamesMaxRoll.map((maxRoll) => rollProduce(maxRoll));
  const gamesPowerSum = gamesPower.reduce(sum);
  return gamesPowerSum;
};

console.log("::part1 =>", solve1(input));
// ::part1 => 2913
console.log("::part2 =>", solve2(input));
// ::part2 => 55593
