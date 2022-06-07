type MapFunction = (value?: any, index?: number, array?: any[]) => any;

export const rollDice = (sides: number, amount: number) => {
  return times(amount, () => rollDie(sides));
};

const rollDie = (sides: number) => {
  const min = 1;
  const max = sides;
  const result = Math.floor(min + Math.random() * max);
  return result;
};

const times = (n: number, mapFunction: MapFunction) =>
  [...new Array(n)].map(mapFunction);
