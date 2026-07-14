import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === "/") return null;

  return (
    <div className="container mx-auto px-4 pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
        className="gap-2 bg-white/60 backdrop-blur"
        aria-label="Go back"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </div>
  );
};

export default BackButton;
