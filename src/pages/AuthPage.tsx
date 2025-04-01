
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            toast.error('Error retrieving user profile');
            return;
          }

          if (profileData) {
            toast.success(`Welcome ${profileData.role === 'admin' ? 'Admin' : 'User'}!`);
            navigate('/');
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast.error('Error retrieving user profile');
        }
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };

  const handleSignUp = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Sign up successful! Please check your email to verify.');
    } catch (err) {
      toast.error('Sign up failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Lemonade Login</h2>
        <div className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex space-x-4">
            <Button onClick={handleSignIn} className="w-full">Sign In</Button>
            <Button onClick={handleSignUp} variant="secondary" className="w-full">Sign Up</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
