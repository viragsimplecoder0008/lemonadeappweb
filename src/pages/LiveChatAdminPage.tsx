
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAdmin } from "@/context/AdminContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, Users, Clock } from "lucide-react";

interface ChatMessage {
  id: string;
  customerId: string;
  customerName: string;
  message: string;
  timestamp: Date;
  isFromCustomer: boolean;
  isRead: boolean;
}

interface ChatRoom {
  customerId: string;
  customerName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isActive: boolean;
}

const LiveChatAdminPage: React.FC = () => {
  const { isEmployee, isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [chatRooms] = useState<ChatRoom[]>([
    {
      customerId: "customer1",
      customerName: "John D.",
      lastMessage: "I need help with my order",
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000),
      unreadCount: 2,
      isActive: true
    },
    {
      customerId: "customer2", 
      customerName: "Sarah M.",
      lastMessage: "Thank you for your help!",
      lastMessageTime: new Date(Date.now() - 15 * 60 * 1000),
      unreadCount: 0,
      isActive: false
    },
    {
      customerId: "customer3",
      customerName: "Mike R.",
      lastMessage: "When will my order arrive?",
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000),
      unreadCount: 1,
      isActive: true
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      customerId: "customer1",
      customerName: "John D.",
      message: "Hello, I need help with my recent order",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      isFromCustomer: true,
      isRead: true
    },
    {
      id: "2",
      customerId: "customer1",
      customerName: "Support",
      message: "Hi John! I'd be happy to help you with your order. What seems to be the issue?",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isFromCustomer: false,
      isRead: true
    },
    {
      id: "3",
      customerId: "customer1",
      customerName: "John D.",
      message: "I haven't received my tracking information yet",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isFromCustomer: true,
      isRead: false
    }
  ]);

  // Redirect if not employee or admin
  useEffect(() => {
    if (!isEmployee && !isAdmin) {
      navigate("/live-chat");
    }
  }, [isEmployee, isAdmin, navigate]);

  if (!isEmployee && !isAdmin) {
    return null; // Component will unmount due to redirect
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedRoom) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      customerId: selectedRoom,
      customerName: "Support",
      message: newMessage,
      timestamp: new Date(),
      isFromCustomer: false,
      isRead: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const selectedRoomMessages = messages.filter(msg => msg.customerId === selectedRoom);
  const selectedRoomInfo = chatRooms.find(room => room.customerId === selectedRoom);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Live Chat Administration</h1>
          <p className="text-gray-600">Manage customer support conversations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
          {/* Chat Rooms List */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Active Chats</h2>
              <Badge variant="secondary">
                <Users className="h-4 w-4 mr-1" />
                {chatRooms.filter(room => room.isActive).length}
              </Badge>
            </div>
            
            <ScrollArea className="h-[600px]">
              <div className="space-y-2">
                {chatRooms.map((room) => (
                  <div
                    key={room.customerId}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedRoom === room.customerId
                        ? 'bg-lemonade-yellow/20 border-lemonade-yellow'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedRoom(room.customerId)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{room.customerName}</span>
                      <div className="flex items-center gap-2">
                        {room.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {room.unreadCount}
                          </Badge>
                        )}
                        {room.isActive && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {room.lastMessageTime.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>

          {/* Chat Window */}
          <Card className="col-span-2">
            {selectedRoom ? (
              <div className="flex flex-col h-full">
                {/* Chat Header */}
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{selectedRoomInfo?.customerName}</h3>
                      <p className="text-sm text-gray-600">Customer ID: {selectedRoom}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedRoomInfo?.isActive && (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600">Online</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedRoomMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isFromCustomer ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isFromCustomer
                              ? 'bg-gray-100 text-gray-900'
                              : 'bg-lemonade-yellow text-black'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
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

                {/* Message Input */}
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Select a chat to start messaging</p>
                  <p className="text-sm">Choose a customer from the list to view their conversation</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LiveChatAdminPage;
