
import React from "react";
import Layout from "@/components/layout/Layout";
import GameCanvas from "@/components/mini-game/GameCanvas";
import GameControls from "@/components/mini-game/GameControls";
import GameInfo from "@/components/mini-game/GameInfo";
import { useGameLogic } from "@/components/mini-game/useGameLogic";

const MiniGamePage: React.FC = () => {
  const {
    score,
    setScore,
    gameStarted,
    gameOver,
    setGameOver,
    highScore,
    setHighScore,
    misses,
    setMisses,
    startGame,
    restartGame
  } = useGameLogic();

  return (
    <Layout showCommunityHelp={false}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Lemon Catcher Game</h1>
        
        <div className="max-w-3xl mx-auto">
          <GameInfo highScore={highScore} />
          <p className="text-center mb-2 text-sm text-gray-600">
            Catch 100 lemons with fewer than 20 misses to earn a 20% discount on Strawberry Lemonade! Misses: {misses}/20
          </p>
          
          <div className="flex justify-center mb-4">
            <GameControls
              onStart={startGame}
              onRestart={restartGame}
              gameStarted={gameStarted}
              gameOver={gameOver}
              score={score}
            />
          </div>
          
          <div className="flex justify-center">
            <GameCanvas
              gameStarted={gameStarted}
              gameOver={gameOver}
              score={score}
              setScore={setScore}
              setGameOver={setGameOver}
              highScore={highScore}
              setHighScore={setHighScore}
              misses={misses}
              setMisses={setMisses}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MiniGamePage;
