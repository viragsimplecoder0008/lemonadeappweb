
import React from 'react';

interface GameInfoProps {
  highScore: number;
}

const GameInfo: React.FC<GameInfoProps> = ({ highScore }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <p className="text-center mb-2">
        Catch falling lemons with your glass to win! Use arrow keys, WASD, or touch/mouse to move.
      </p>
      <p className="text-center font-semibold">High Score: {highScore}</p>
    </div>
  );
};

export default GameInfo;
