
export interface GameObject {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  type: "lemon";
}

export interface GameControlProps {
  onStart: () => void;
  onRestart: () => void;
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
}

export interface GameCanvasProps {
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  setGameOver: (gameOver: boolean) => void;
  highScore: number;
  setHighScore: React.Dispatch<React.SetStateAction<number>>;
  misses: number;
  setMisses: React.Dispatch<React.SetStateAction<number>>;
}
