

export const DiceColours = ['red', 'blue', 'green', 'yellow', 'white', 'black'] as const;
export type DiceColour = typeof DiceColours[number];

export const DiceNames: {[k in DiceColour]: string} = {
  red: 'Fire',
  blue: 'Water',
  green: 'Nature',
  white: 'Air',
  yellow: 'Light',
  black: 'Dark'
};

