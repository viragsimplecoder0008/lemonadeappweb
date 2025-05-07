
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface Message {
  id: string;
  name: string;
  message: string;
  timestamp: string;
}

export const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    // Get messages from localStorage
    const getEmployeeMessages = (): Message[] => {
      const stored = localStorage.getItem('employeeMessages');
      return stored ? JSON.parse(stored) : [];
    };
    
    setMessages(getEmployeeMessages());
  }, []);
  
  return (
    <div className="w-full">
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
    </div>
  );
};
