import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
}

const LiveChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! Welcome to Lemonade support. How can I help you today?",
      sender: 'support',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: Message = {
        id: messages.length + 1,
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage("");

      // Simulate support response
      setTimeout(() => {
        const supportMessage: Message = {
          id: messages.length + 2,
          text: "Thank you for your message! A support representative will respond shortly. For immediate assistance, please email us at viraj.vmaster1@gmail.com",
          sender: 'support',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, supportMessage]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-lemonade-yellow mb-4">
              <MessageCircle className="h-8 w-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Live Chat Support</h1>
            <p className="text-gray-600">
              Get instant help from our support team
            </p>
          </div>

          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-medium">Chat with Lemonade Support</h3>
              <p className="text-sm text-gray-500">We typically respond within a few minutes</p>
            </div>

            <ScrollArea className="h-96 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-lemonade-yellow text-black'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-lemonade-yellow hover:bg-lemonade-green text-black"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need immediate assistance? You can also reach us directly:
            </p>
            <a 
              href="mailto:viraj.vmaster1@gmail.com"
              className="inline-block px-6 py-3 bg-lemonade-yellow hover:bg-lemonade-green text-black rounded-md font-medium transition-colors"
            >
              Email Us Directly
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LiveChatPage;