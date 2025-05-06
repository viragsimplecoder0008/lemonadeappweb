
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAdmin } from "@/context/AdminContext";

interface AdminVerificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminVerification: React.FC<AdminVerificationProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const { setAdminMode } = useAdmin();

  const handleVerify = () => {
    if (password === "admin123") {
      setAdminMode(true);
      toast.success("Admin mode activated");
      setPassword("");
      onClose();
    } else {
      toast.error("Incorrect password");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Verification</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="password">Admin Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleVerify}>Verify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
