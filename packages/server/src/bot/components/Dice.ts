import { MessageInteraction } from 'discord.js';

type MapFunction = (value?: any, index?: number, array?: any[]) => any;

type DiceResults = {
  results: number[];
  sum: number;
};

export const rollDice = (sides: number, amount: number): DiceResults => {
  const results = times(amount, () => rollDie(sides));

  return {
    results,
    sum: results.reduce((prev: number, current: number) => prev + current, 0),
  };
};

const rollDie = (sides: number) => {
  const min = 1;
  const max = sides;
  const result = Math.floor(min + Math.random() * max);
  return result;
};

const times = (n: number, mapFunction: MapFunction) =>
  [...new Array(n)].map(mapFunction);

export const createDiceEmbed = (
  sides: number,
  amount: number,
  results: DiceResults
) => ({
  type: 'rich',
  title: `Results (\`${amount} D${sides}\`)`,
  description: ``,
  color: 0xffb8d9,
  fields: [
    {
      name: `Rolls:`,
      value: ` \`${results.results.join(' · ')}\``,
      inline: false,
    },
    {
      name: `Total:`,
      value: `\`${results.sum}\``,
      inline: false,
    },
  ],
});
