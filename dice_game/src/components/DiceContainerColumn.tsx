import React from "react";
import { DiceColours } from "../lib/Dice";
import { DiceContainer } from "./DiceContainer";

import "./DiceContainerColumn.css";

export const DiceContainerColumn = () => {
  return (
    <div className="dice-container-column">
      {DiceColours.map(colour => (
        <DiceContainer colour={colour} />
      ))}
    </div>
  )
};
