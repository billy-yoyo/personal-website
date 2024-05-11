import React, { useContext, useMemo } from "react";
import { DiceColour, DiceNames } from "../lib/Dice";
import { DiceAmountsContext } from "../lib/contexts";
import { Die } from "./Die";

import "./DiceContainer.css";

interface Props {
  colour: DiceColour
}

const MAX_DICE_SHOWN = 4;

const amountRepresentation = (amount: number): string => {
  let remainder = amount - MAX_DICE_SHOWN;

  const units = ['', 'k', 'm', 'b', 't'];
  let unitIndex = 0;
  while (remainder >= 1000 && unitIndex < units.length) {
    unitIndex += 1;
    remainder = Math.floor(remainder / 1000);
  }

  let repr; // max length is 6
  if (unitIndex >= units.length) {
    repr = '+ lots';
  } else {
    repr = `+ ${remainder}${units[unitIndex]}`;
  }

  return repr;
}

export const DiceContainer = ({ colour } : Props) => {
  const { diceAmounts } = useContext(DiceAmountsContext);
  const [amount, repr] = useMemo(() => [diceAmounts[colour], amountRepresentation(diceAmounts[colour])], [colour, diceAmounts]);

  return (
    <div className={`dice-container ${colour}`}>
      <div className="title">
        {DiceNames[colour]}
      </div>
      <div className="dice">
        {new Array(Math.min(amount, MAX_DICE_SHOWN)).fill(0).map(() => (
          <Die colour={colour} value={6} />
        ))}
      </div>
      {amount > MAX_DICE_SHOWN && (
        <div className={`additional-amount r${repr.length}`}>
          {repr}
        </div>
      )}
    </div>
  )
};
