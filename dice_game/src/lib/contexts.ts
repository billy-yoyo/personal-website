import React from "react";
import { DiceColour, DiceColours } from "./Dice";

const contextHelper = <T>(defaultValue: T) => React.createContext<{
  diceAmounts: T,
  setDiceAmounts: React.Dispatch<React.SetStateAction<T>>
}>({ diceAmounts: defaultValue, setDiceAmounts: () => {} });


export type DiceAmounts = {[key in DiceColour]: number};
export const defaultDiceAmounts = Object.fromEntries(DiceColours.map(colour => [colour, Math.floor(Math.random() * 31512) + 1])) as DiceAmounts;
export const DiceAmountsContext = contextHelper(defaultDiceAmounts);


