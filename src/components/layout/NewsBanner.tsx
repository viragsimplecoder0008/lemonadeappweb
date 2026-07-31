import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, X, Flame } from "lucide-react";

interface NewsBannerProps {
  onClose?: () => void;
}

const NewsBanner: React.FC<NewsBannerProps> = ({ onClose }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 via-lemonade-yellow to-amber-500 text-slate-950 px-4 py-2 text-xs md:text-sm font-medium shadow-md flex items-center justify-between border-b border-amber-400/60">
      <div className="flex flex-wrap items-center justify-center gap-2 mx-auto text-center">
        <span className="bg-slate-950 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <Sparkles className="h-3 w-3" /> NEWS
        </span>
        <span className="font-semibold">New section added!</span>
        <Link to="/monsoon-winter" className="underline hover:text-slate-800 transition-colors font-bold">
          Explore our Monsoon/Winter selection!
        </Link>
        <span className="hidden sm:inline mx-1 opacity-60">•</span>
        <span className="font-semibold flex items-center gap-1">
          <Flame className="h-3.5 w-3.5 text-red-600 inline" /> New Product!
        </span>
        <Link to="/products/monsoon/Hot-Chocolate" className="underline hover:text-slate-800 transition-colors font-bold">
          Check out Hot Chocolate!
        </Link>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/10 rounded-full transition-colors ml-2 flex-shrink-0"
          aria-label="Close news banner"
        >
          <X className="h-4 w-4 text-slate-950" />
        </button>
      )}
    </div>
  );
};

export default NewsBanner;
