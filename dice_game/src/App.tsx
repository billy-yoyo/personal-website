import React, { useState } from 'react';
import './App.css';
import { DiceColour, DiceColours } from './lib/Dice';
import { DiceAmounts, DiceAmountsContext, defaultDiceAmounts } from './lib/contexts';
import { DiceContainerColumn } from './components/DiceContainerColumn';





function App() {
  const [diceAmounts, setDiceAmounts] = useState<DiceAmounts>(defaultDiceAmounts);

  return (
    <div className="App">
      <DiceAmountsContext.Provider value={{ diceAmounts, setDiceAmounts }}>
        <DiceContainerColumn />
      </DiceAmountsContext.Provider>
    </div>
  );
}

export default App;
