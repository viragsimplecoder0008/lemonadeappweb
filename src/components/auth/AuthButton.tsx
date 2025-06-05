
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

const AuthButton: React.FC = () => {
  // For now, we'll assume the user is not authenticated
  // This will be updated when full authentication is implemented
  const isAuthenticated = false;

  if (isAuthenticated) {
    return (
      <Button variant="outline" size="sm">
        Profile
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/auth">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    </div>
  );
};

export default AuthButton;
