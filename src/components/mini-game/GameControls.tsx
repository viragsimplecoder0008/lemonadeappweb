
import React from 'react';
import { Button } from "@/components/ui/button";
import { GameControlProps } from "./types";

const GameControls: React.FC<GameControlProps> = ({ 
  onStart, 
  onRestart, 
  gameStarted, 
  gameOver, 
  score 
}) => {
  if (gameStarted && !gameOver) {
    return null;
  }
  
  if (gameOver) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
        <p className="mb-4">Your final score: {score}</p>
        <Button onClick={onRestart} className="bg-lemonade-yellow text-lemonade-dark hover:bg-lemonade-yellow/80">
          Play Again
        </Button>
      </div>
    );
  }
  
  return (
    <Button onClick={onStart} className="bg-lemonade-yellow text-lemonade-dark hover:bg-lemonade-yellow/80">
      Start Game
    </Button>
  );
};

export default GameControls;
