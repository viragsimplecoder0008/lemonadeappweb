
import { useState, useEffect, useRef } from "react";
import { GameObject } from "./types";
import { toast } from "@/components/ui/use-toast";

export function useGameLogic() {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState<number>(0);
  
  // Load saved high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("lemonCatcherHighScore");
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, []);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };
  
  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setTimeout(() => {
      setGameStarted(true);
      setScore(0);
    }, 100);
  };
  
  return {
    score,
    setScore,
    gameStarted,
    setGameStarted,
    gameOver,
    setGameOver,
    highScore,
    setHighScore,
    startGame,
    restartGame
  };
}
