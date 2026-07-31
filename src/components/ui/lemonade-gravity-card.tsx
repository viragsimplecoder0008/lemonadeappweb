"use client";

import React, { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export interface LemonadeGravityCardProps {
  className?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export const LemonadeGravityCard: React.FC<LemonadeGravityCardProps> = ({
  className,
  title,
  description = "Experience the perfect blend of sweet and tart with our handcrafted lemonade varieties. Flawlessly smooth and refreshingly vibrant."
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ringState, setRingState] = useState<'hidden' | 'animating' | 'visible'>('visible');

  const defaultTitle = (
    <>
      <span className={cn("drop-shadow-sm", isDark ? "text-white" : "text-slate-900")}>
        Lemonade
      </span>
      <br />
      <span className="text-lemonade-yellow">For Every</span>
      <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-400 to-emerald-400 drop-shadow-md">
        Taste.
      </span>
    </>
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 540);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Try loading bottle image if available
    const bottleImg = new Image();
    let imgLoaded = false;
    bottleImg.src = "/lovable-uploads/d7db3374-6ea0-4b1c-acc3-03ca449c70d0.png";
    bottleImg.onload = () => { imgLoaded = true; };

    // Particles system
    const numParticles = 1200;
    const particles = Array.from({ length: numParticles }, () => {
      const angle = Math.random() * Math.PI * 2;
      const rx = 150 + Math.random() * 100;
      const ry = 45 + Math.random() * 30;
      const palette = Math.random();
      let color = "#F9D923";
      if (palette > 0.8) color = "#36AE7C";
      else if (palette > 0.6) color = "#FFFFFF";
      else if (palette > 0.4) color = "#FB923C";

      return {
        angle,
        rx,
        ry,
        speed: (0.008 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : -1),
        size: Math.random() * 2.5 + 0.8,
        color,
        z: Math.random() * 2 - 1,
        sparkle: Math.random() * Math.PI * 2,
      };
    });

    // Ice Cubes & Lemon Slices
    const numIce = 35;
    const iceCubes = Array.from({ length: numIce }, () => ({
      angle: Math.random() * Math.PI * 2,
      rx: 160 + Math.random() * 80,
      ry: 50 + Math.random() * 25,
      speed: (0.004 + Math.random() * 0.008) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 8 + 4,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      z: Math.random() * 2 - 1,
    }));

    // Rising Fizz Bubbles inside bottle
    const numFizz = 25;
    const fizzBubbles = Array.from({ length: numFizz }, () => ({
      x: (Math.random() - 0.5) * 35,
      y: Math.random() * 120 - 60,
      speed: 0.5 + Math.random() * 1.2,
      radius: 1 + Math.random() * 2.5,
    }));

    let progress = ringState === 'visible' ? 1.0 : 0.0;
    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const bottleYBob = Math.sin(time * 1.5) * 8;

      if (ringState === 'animating') {
        progress += 0.03;
        if (progress >= 1.0) progress = 1.0;
      } else if (ringState === 'visible') {
        progress = 1.0;
      } else {
        progress = 0.0;
      }

      // 1. Render Behind Particles (z < 0)
      if (progress > 0.05) {
        ctx.save();
        ctx.globalCompositeOperation = isDark ? "screen" : "source-over";
        particles.forEach((p) => {
          p.angle += p.speed;
          p.sparkle += 0.05;

          const cos = Math.cos(p.angle);
          const sin = Math.sin(p.angle);
          if (sin >= 0) return; // Behind bottle

          const x = centerX + cos * (p.rx * progress);
          const y = centerY + bottleYBob + sin * (p.ry * progress);

          ctx.beginPath();
          ctx.arc(x, y, p.size * (0.8 + 0.3 * Math.sin(p.sparkle)), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, progress * 0.85);
          ctx.fill();
        });
        ctx.restore();
      }

      // 2. Render 3D Lemonade Bottle in Center
      ctx.save();
      ctx.translate(centerX, centerY + bottleYBob);

      // Floor Shadow
      ctx.beginPath();
      ctx.ellipse(0, 110, 60, 15, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(217, 119, 6, 0.25)";
      ctx.fill();

      if (imgLoaded) {
        // Draw real bottle image asset
        const w = 180;
        const h = 260;
        ctx.drawImage(bottleImg, -w / 2, -h / 2, w, h);
      } else {
        // Draw 3D Procedural Glass Lemonade Bottle
        // Bottle Outer Glass Outline
        ctx.beginPath();
        ctx.moveTo(-25, -90); // Cap
        ctx.lineTo(25, -90);
        ctx.lineTo(20, -70); // Neck
        ctx.lineTo(20, -40);
        ctx.bezierCurveTo(45, -20, 50, 20, 50, 80); // Shoulder & Body
        ctx.lineTo(-50, 80);
        ctx.bezierCurveTo(-50, 20, -45, -20, -20, -40);
        ctx.lineTo(-20, -70);
        ctx.closePath();

        // Liquid Gradient
        const liqGrad = ctx.createLinearGradient(0, -30, 0, 80);
        liqGrad.addColorStop(0, "#FFE082");
        liqGrad.addColorStop(0.5, "#FDD835");
        liqGrad.addColorStop(1, "#F57F17");

        ctx.fillStyle = liqGrad;
        ctx.fill();
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(251, 191, 36, 0.8)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glass Highlight
        ctx.beginPath();
        ctx.moveTo(-35, -10);
        ctx.bezierCurveTo(-38, 20, -38, 50, -35, 70);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Cork Stopper
        ctx.fillStyle = "#A1887F";
        ctx.fillRect(-15, -102, 30, 14);

        // Lemon Slice Emblem on bottle
        ctx.beginPath();
        ctx.arc(0, 20, 18, 0, Math.PI * 2);
        ctx.fillStyle = "#FFF59D";
        ctx.fill();
        ctx.strokeStyle = "#F57F17";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Fizz Bubbles rising inside
        fizzBubbles.forEach((b) => {
          b.y -= b.speed;
          if (b.y < -30) b.y = 75;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fill();
        });
      }

      ctx.restore();

      // 3. Render In-Front Particles & Ice Cubes (z >= 0)
      if (progress > 0.05) {
        ctx.save();
        ctx.globalCompositeOperation = isDark ? "screen" : "source-over";

        // Particle Ring In-Front
        particles.forEach((p) => {
          const cos = Math.cos(p.angle);
          const sin = Math.sin(p.angle);
          if (sin < 0) return; // In front

          const x = centerX + cos * (p.rx * progress);
          const y = centerY + bottleYBob + sin * (p.ry * progress);

          ctx.beginPath();
          ctx.arc(x, y, p.size * (0.8 + 0.3 * Math.sin(p.sparkle)), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(1, progress * 0.95);
          ctx.fill();
        });

        // Orbiting Ice Cubes In-Front
        iceCubes.forEach((ast) => {
          ast.angle += ast.speed;
          ast.rot += ast.rotSpeed;

          const cos = Math.cos(ast.angle);
          const sin = Math.sin(ast.angle);
          const x = centerX + cos * (ast.rx * progress);
          const y = centerY + bottleYBob + sin * (ast.ry * progress);

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(ast.rot);
          ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 248, 225, 0.9)";
          ctx.strokeStyle = "#F9D923";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.rect(-ast.size / 2, -ast.size / 2, ast.size, ast.size);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isDark, ringState]);

  const handleOrbClick = () => {
    if (ringState === 'hidden') setRingState('animating');
    else setRingState('hidden');
  };

  return (
    <div
      className={cn(
        "w-full max-w-[1000px] min-h-[540px] rounded-[2.5rem] flex flex-col md:flex-row relative overflow-hidden transition-colors duration-300 border shadow-2xl",
        isDark
          ? "bg-black border-white/[0.08] shadow-[0_30px_100px_rgba(0,0,0,0.7)] text-slate-100"
          : "bg-amber-50/90 border-amber-200/80 shadow-[0_30px_100px_rgba(249,217,35,0.25)] text-slate-900",
        className
      )}
    >
      {/* Dark/Light Gradient Overlay */}
      <div
        className={cn(
          "absolute top-0 left-0 md:inset-y-0 md:left-0 w-full h-[60%] md:h-full md:w-[60%] z-10 pointer-events-none transition-colors duration-300",
          isDark
            ? "bg-gradient-to-b md:bg-gradient-to-r from-black via-black/90 to-transparent"
            : "bg-gradient-to-b md:bg-gradient-to-r from-amber-50 via-amber-50/90 to-transparent"
        )}
      />

      {/* Left Column Content */}
      <div className="w-full md:w-[50%] flex flex-col justify-center px-8 py-12 md:p-0 md:pl-16 relative z-20 pointer-events-none">
        <h2 className="text-[3.5rem] sm:text-[4.5rem] md:text-[5rem] font-bold tracking-tighter leading-[0.95] mb-6">
          {title || defaultTitle}
        </h2>
        <p
          className={cn(
            "text-base md:text-lg font-medium leading-relaxed max-w-[360px]",
            isDark ? "text-zinc-400" : "text-slate-700"
          )}
        >
          {description}
        </p>

        <div className="mt-8 pointer-events-auto flex items-center gap-4">
          <button
            onClick={handleOrbClick}
            className="px-7 py-3.5 rounded-full bg-lemonade-yellow hover:bg-lemonade-green text-slate-950 font-bold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-sm flex items-center gap-2"
          >
            <span>{ringState === 'hidden' ? "Unleash Ring ✨" : "Reset Ring 🍋"}</span>
          </button>
        </div>
      </div>

      {/* 3D Lemonade Bottle & Particle Canvas */}
      <div
        onClick={handleOrbClick}
        className="relative md:absolute md:right-0 md:top-0 w-full h-[380px] md:h-full md:w-[60%] pointer-events-auto z-0 flex items-center justify-center cursor-pointer"
        title="Click to toggle citrus particle ring animation!"
      >
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default LemonadeGravityCard;
