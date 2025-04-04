
import React, { useState, useRef, useEffect } from "react";
import { Send, User, MessageSquare, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
}

interface UserInfo {
  name: string;
  lastInitial: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tempName, setTempName] = useState("");
  const [tempLastInitial, setTempLastInitial] = useState("");
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [liveNewMessage, setLiveNewMessage] = useState("");
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const liveChatEndRef = useRef<HTMLDivElement>(null);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (liveChatEndRef.current) {
      liveChatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !userInfo) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: `${userInfo.name} ${userInfo.lastInitial}.`,
      avatar: "",
      message: newMessage,
      timestamp: new Date(),
    };
    
    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tempName.trim() || !tempLastInitial.trim()) {
      toast.error("Please enter your name and last initial");
      return;
    }
    
    setUserInfo({
      name: tempName,
      lastInitial: tempLastInitial
    });
    
    toast.success("Welcome to the community chat!");
  };

  const handleSendLiveMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!liveNewMessage.trim() || !userInfo) return;
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      user: `${userInfo.name} ${userInfo.lastInitial}.`,
      avatar: "",
      message: liveNewMessage,
      timestamp: new Date(),
    };
    
    // In a real app, this would be sent to a real-time service
    setLiveMessages([...liveMessages, message]);
    setLiveNewMessage("");
  };

  return (
    <Layout showCommunityHelp={false}>
      <div className="container mx-auto py-8 px-4">
        {!userInfo ? (
          <Card className="max-w-md mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Join the Community</h2>
            <p className="mb-6 text-gray-600">Please enter your details to join the community chat.</p>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">First Name</label>
                <Input 
                  id="name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastInitial" className="text-sm font-medium">Last Initial</label>
                <Input 
                  id="lastInitial"
                  value={tempLastInitial}
                  onChange={(e) => setTempLastInitial(e.target.value)}
                  placeholder="E.g. J for Johnson"
                  maxLength={1}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-lemonade-yellow hover:bg-lemonade-green text-black">
                Join Chat
              </Button>
            </form>
          </Card>
        ) : (
          <div className="bg-white shadow-md rounded-lg max-w-4xl mx-auto">
            <div className="p-4 bg-lemonade-yellow rounded-t-lg flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black">Lemonade Community Chat</h1>
                <p className="text-black/80">Connect with other lemonade enthusiasts</p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="border-black bg-white hover:bg-gray-100">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Live Chat
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[90%] sm:w-[540px]">
                  <SheetHeader>
                    <SheetTitle>Live Chat</SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-4 flex flex-col h-[calc(100vh-180px)]">
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-md mb-4">
                      {liveMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-500">
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      ) : (
                        liveMessages.map((msg) => (
                          <Card key={msg.id} className={`mb-4 p-3 ${msg.user.startsWith(userInfo.name) ? "ml-auto bg-lemonade-yellow/20 max-w-[80%]" : "max-w-[80%]"}`}>
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
                        ))
                      )}
                      <div ref={liveChatEndRef} />
                    </div>
                    
                    <form onSubmit={handleSendLiveMessage} className="flex gap-2">
                      <Input 
                        type="text" 
                        value={liveNewMessage} 
                        onChange={(e) => setLiveNewMessage(e.target.value)} 
                        placeholder="Type your message..." 
                        className="flex-1"
                      />
                      <Button type="submit">
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </form>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Chat area */}
            <div className="p-4 h-[500px] overflow-y-auto bg-gray-50">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <User className="h-12 w-12 mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Welcome, {userInfo.name} {userInfo.lastInitial}.</p>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <Card key={msg.id} className={`mb-4 p-3 ${msg.user.startsWith(userInfo.name) ? "ml-auto bg-lemonade-yellow/20 max-w-[80%]" : "max-w-[80%]"}`}>
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
                ))
              )}
              <div ref={chatEndRef} />
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
        )}
        
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
