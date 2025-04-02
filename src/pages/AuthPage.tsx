
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      // Handle special case for admin
      if (email === 'admin@lemonade.com' && password === 'admin123') {
        // Admin login with hardcoded credentials
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: 'admin123' // Use the correct admin password
        });

        if (error) {
          toast.error(error.message);
          setIsLoading(false);
          return;
        }

        toast.success('Welcome Admin!');
        navigate('/');
        return;
      }

      // Regular user login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      console.error("Login error:", err);
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        setIsLoading(false);
        return;
      }

      toast.success('Sign up successful! Please check your email to verify.');
      // Don't automatically sign in after signup as it might fail due to DB issues
      setIsLoading(false);
    } catch (err) {
      console.error("Signup error:", err);
      toast.error('Sign up failed. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center" 
      style={{ 
        backgroundImage: `url('/lovable-uploads/9ecf7f78-eec4-42f5-874d-682b9a1f48c8.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-lemonade-yellow">Lemonade Login</h2>
        <div className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="border-lemonade-yellow/50 focus:border-lemonade-yellow"
            disabled={isLoading}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="border-lemonade-yellow/50 focus:border-lemonade-yellow"
            disabled={isLoading}
          />
          <div className="flex space-x-4">
            <Button 
              onClick={handleSignIn} 
              className="w-full bg-lemonade-yellow hover:bg-lemonade-yellow/80 text-black font-medium"
              disabled={isLoading}
            >
              Sign In
            </Button>
            <Button 
              onClick={handleSignUp} 
              variant="secondary" 
              className="w-full"
              disabled={isLoading}
            >
              Sign Up
            </Button>
          </div>
          <div className="text-xs text-center text-gray-500 mt-4">
            Admin login: admin@lemonade.com / admin123
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
