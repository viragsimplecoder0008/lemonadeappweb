import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAdmin } from "@/context/AdminContext";
import { supabase } from "@/integrations/supabase/client";

interface AdminVerificationProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminVerification: React.FC<AdminVerificationProps> = ({ isOpen, onClose }) => {
  const { setAdminMode } = useAdmin();
  const [checking, setChecking] = useState(false);

  const handleVerify = async () => {
    setChecking(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in first");
      setChecking(false);
      return;
    }
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    setChecking(false);
    if (error || !data) {
      toast.error("Your account does not have admin access");
      return;
    }
    setAdminMode(true);
    toast.success("Admin mode activated");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Admin Verification</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-sm text-muted-foreground">
          Admin access is granted server-side via your user role. Click verify to enable admin mode for your signed-in account.
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleVerify} disabled={checking}>{checking ? "Checking..." : "Verify"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
