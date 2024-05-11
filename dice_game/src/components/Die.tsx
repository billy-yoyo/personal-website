import React from 'react';
import { DiceColour } from '../lib/Dice';

import "./Die.css";

interface Props {
  colour: DiceColour,
  value: number
}

export const Die = ({ colour, value }: Props): React.JSX.Element => {

  return (
    <div className={`die ${colour} n${value}`}></div>
  )
}
