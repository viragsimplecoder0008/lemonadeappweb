
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Message {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

interface AdminMessagesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ 
  isOpen, 
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Fetch messages from localStorage whenever the dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);
  
  // Function to get messages from localStorage
  const fetchMessages = () => {
    const stored = localStorage.getItem('employeeMessages');
    const loadedMessages = stored ? JSON.parse(stored) : [];
    setMessages(loadedMessages);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Employee Messages</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{msg.name}</h4>
                    <span className="text-xs text-gray-500">
                      {format(new Date(msg.timestamp), "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No messages from employees yet.
            </div>
          )}
        </ScrollArea>
        
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
