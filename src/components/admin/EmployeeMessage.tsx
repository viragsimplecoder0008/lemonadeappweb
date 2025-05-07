
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

interface EmployeeMessageProps {
  isOpen: boolean;
  onClose: () => void;
}

// In a real app, these would be stored in a database
// Using localStorage for persistent storage in this demo
const getEmployeeMessages = (): Message[] => {
  const stored = localStorage.getItem('employeeMessages');
  return stored ? JSON.parse(stored) : [];
};

const saveEmployeeMessages = (messages: Message[]) => {
  localStorage.setItem('employeeMessages', JSON.stringify(messages));
};

export const EmployeeMessage: React.FC<EmployeeMessageProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Create new message
    const newMessage: Message = {
      id: Date.now().toString(),
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toISOString()
    };

    // Add to messages
    const currentMessages = getEmployeeMessages();
    const updatedMessages = [newMessage, ...currentMessages];
    saveEmployeeMessages(updatedMessages);
    
    toast.success("Message sent to admin");
    setName("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Employee Message to Admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message for the admin"
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Send Message</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
