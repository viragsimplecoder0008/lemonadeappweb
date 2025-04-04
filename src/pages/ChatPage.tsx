
import React, { useState } from "react";
import { Send, User } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
}

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    user: "Sarah J.",
    avatar: "",
    message: "Has anyone tried the strawberry lemonade? Is it as good as everyone says?",
    timestamp: new Date(2025, 3, 3, 14, 23),
  },
  {
    id: "2",
    user: "Michael T.",
    avatar: "",
    message: "The strawberry lemonade is amazing! It's my favorite summer drink. Perfect balance of sweet and tart.",
    timestamp: new Date(2025, 3, 3, 14, 30),
  },
  {
    id: "3",
    user: "Emily R.",
    avatar: "",
    message: "I prefer the lavender lemonade personally, but the strawberry is definitely a close second!",
    timestamp: new Date(2025, 3, 3, 14, 35),
  },
  {
    id: "4",
    user: "David K.",
    avatar: "",
    message: "Does anyone know if they're planning to release any new flavors soon?",
    timestamp: new Date(2025, 3, 3, 15, 12),
  },
  {
    id: "5",
    user: "Lemonade Team",
    avatar: "",
    message: "Hi everyone! We're excited to announce that we'll be releasing a new blueberry mint lemonade next month! Stay tuned for more details.",
    timestamp: new Date(2025, 3, 3, 15, 20),
  },
];

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: "You",
      avatar: "",
      message: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  return (
    <Layout showCommunityHelp={false}>
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white shadow-md rounded-lg max-w-4xl mx-auto">
          <div className="p-4 bg-lemonade-yellow rounded-t-lg">
            <h1 className="text-2xl font-bold text-black">Lemonade Community Chat</h1>
            <p className="text-black/80">Connect with other lemonade enthusiasts</p>
          </div>
          
          {/* Chat area */}
          <div className="p-4 h-[500px] overflow-y-auto bg-gray-50">
            {messages.map((msg) => (
              <Card key={msg.id} className={`mb-4 p-3 ${msg.user === "You" ? "ml-auto bg-lemonade-yellow/20 max-w-[80%]" : "max-w-[80%]"}`}>
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {msg.user.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-sm">{msg.user}</p>
                      <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="mt-1">{msg.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Input area */}
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Type your message..." 
                className="flex-1"
              />
              <Button type="submit">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Community Guidelines</h2>
          <Card className="p-4">
            <ul className="space-y-2 list-disc pl-5">
              <li>Be respectful and kind to other community members.</li>
              <li>Stay on topic - this community is for discussing our lemonades and related topics.</li>
              <li>No spam or promotional content without permission.</li>
              <li>Share your favorite recipes and lemonade experiences!</li>
              <li>Have fun and enjoy connecting with fellow lemonade enthusiasts.</li>
            </ul>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
