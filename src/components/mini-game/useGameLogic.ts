
import { useState, useEffect, useRef } from "react";
import { GameObject } from "./types";
import { toast } from "@/components/ui/use-toast";

export function useGameLogic() {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState<number>(0);
  const [misses, setMisses] = useState(0);
  
  // Load saved high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("lemonCatcherHighScore");
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, []);
  
  // Check for discount achievement
  useEffect(() => {
    if (score >= 100 && misses <= 20 && gameOver) {
      // Apply discount for strawberry lemonade
      localStorage.setItem("strawberryLemonadeDiscount", "20");
      toast({
        title: "Discount Unlocked!",
        description: "You've earned a 20% discount on Strawberry Lemonade! The discount will be applied automatically at checkout.",
        duration: 5000,
      });
    }
  }, [score, misses, gameOver]);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setMisses(0);
  };
  
  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setTimeout(() => {
      setGameStarted(true);
      setScore(0);
      setMisses(0);
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
    misses,
    setMisses,
    startGame,
    restartGame
  };
}
