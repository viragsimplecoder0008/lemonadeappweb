
import React, { useEffect, useState, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface GameObject {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  type: "lemon";
}

const MiniGamePage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState<number>(0);
  
  const glassPosRef = useRef({ x: 0, y: 0 });
  const lemonsRef = useRef<GameObject[]>([]);
  const animationRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const glassWidth = 100;
  const glassHeight = 120;
  const lemonSize = 40;
  
  const lemonImage = useRef<HTMLImageElement | null>(null);
  const glassImage = useRef<HTMLImageElement | null>(null);
  
  // Initialize game
  useEffect(() => {
    // Load saved high score from localStorage
    const savedHighScore = localStorage.getItem("lemonCatcherHighScore");
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
    
    // Load images
    lemonImage.current = new Image();
    lemonImage.current.src = "/lovable-uploads/3090da14-5995-4600-b4bb-0b4dbc70b87b.png";
    
    glassImage.current = new Image();
    glassImage.current.src = "/lovable-uploads/d7db3374-6ea0-4b1c-acc3-03ca449c70d0.png";
    
    // Set up canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResize = () => {
      canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 40;
      canvas.height = 500;
      
      // Update glass position on resize
      glassPosRef.current = {
        x: canvas.width / 2 - glassWidth / 2,
        y: canvas.height - glassHeight - 10
      };
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Initialize glass position
    glassPosRef.current = {
      x: canvas.width / 2 - glassWidth / 2,
      y: canvas.height - glassHeight - 10
    };
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Handle keyboard input
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 20;
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          glassPosRef.current.x = Math.max(0, glassPosRef.current.x - speed);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          glassPosRef.current.x = Math.min(
            canvas.width - glassWidth,
            glassPosRef.current.x + speed
          );
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gameOver]);
  
  // Handle touch/mouse input
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      
      glassPosRef.current.x = Math.max(0, Math.min(canvas.width - glassWidth, mouseX - glassWidth / 2));
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!touchStartRef.current) return;
      
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      
      glassPosRef.current.x = Math.max(0, Math.min(canvas.width - glassWidth, touchX - glassWidth / 2));
    };
    
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gameStarted, gameOver]);
  
  // Create lemons at random intervals
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const createLemon = () => {
      const newLemon: GameObject = {
        id: Date.now(),
        x: Math.random() * (canvas.width - lemonSize),
        y: -lemonSize,
        velocityX: Math.random() * 2 - 1, // Random horizontal movement
        velocityY: 2 + Math.random() * 3, // Random falling speed
        width: lemonSize,
        height: lemonSize,
        type: "lemon",
      };
      
      lemonsRef.current.push(newLemon);
    };
    
    const lemonInterval = setInterval(createLemon, 1000);
    
    return () => {
      clearInterval(lemonInterval);
    };
  }, [gameStarted, gameOver]);
  
  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const gameLoop = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw glass
      if (glassImage.current) {
        ctx.drawImage(
          glassImage.current,
          glassPosRef.current.x,
          glassPosRef.current.y,
          glassWidth,
          glassHeight
        );
      }
      
      // Update and draw lemons
      lemonsRef.current = lemonsRef.current.filter(lemon => {
        // Update lemon position
        lemon.x += lemon.velocityX;
        lemon.y += lemon.velocityY;
        
        // Bounce off walls
        if (lemon.x <= 0 || lemon.x >= canvas.width - lemon.width) {
          lemon.velocityX *= -1;
        }
        
        // Check collision with glass
        const inGlassX = lemon.x + lemon.width / 2 > glassPosRef.current.x &&
                     lemon.x + lemon.width / 2 < glassPosRef.current.x + glassWidth;
        const inGlassY = lemon.y + lemon.height > glassPosRef.current.y &&
                     lemon.y < glassPosRef.current.y + glassHeight / 2;
                     
        if (inGlassX && inGlassY) {
          // Caught a lemon!
          setScore(prevScore => prevScore + 1);
          return false;
        }
        
        // Remove lemons that fall off screen
        if (lemon.y > canvas.height) {
          return false;
        }
        
        // Draw lemon
        if (lemonImage.current) {
          ctx.drawImage(lemonImage.current, lemon.x, lemon.y, lemon.width, lemon.height);
        }
        
        return true;
      });
      
      // Draw score
      ctx.font = "20px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(`Score: ${score}`, 10, 30);
      
      // Check game over condition (too many missed lemons)
      if (score >= 20) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("lemonCatcherHighScore", score.toString());
          toast({
            title: "New High Score!",
            description: `You've set a new high score of ${score}!`
          });
        }
        return;
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameOver, score, highScore]);
  
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    lemonsRef.current = [];
  };
  
  const restartGame = () => {
    setGameStarted(false);
    setGameOver(false);
    lemonsRef.current = [];
    setTimeout(() => {
      setGameStarted(true);
      setScore(0);
    }, 100);
  };
  
  return (
    <Layout showCommunityHelp={false}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Lemon Catcher Game</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <p className="text-center mb-2">
              Catch falling lemons with your glass to win! Use arrow keys, WASD, or touch/mouse to move.
            </p>
            <p className="text-center font-semibold">High Score: {highScore}</p>
          </div>
          
          <div className="flex justify-center mb-4">
            {!gameStarted && !gameOver && (
              <Button onClick={startGame} className="bg-lemonade-yellow text-lemonade-dark hover:bg-lemonade-yellow/80">
                Start Game
              </Button>
            )}
            
            {gameOver && (
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                <p className="mb-4">Your final score: {score}</p>
                <Button onClick={restartGame} className="bg-lemonade-yellow text-lemonade-dark hover:bg-lemonade-yellow/80">
                  Play Again
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded-lg bg-[#FFF8E1] shadow-lg"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MiniGamePage;
