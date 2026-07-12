import React, { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Group { id: string; name: string; description: string | null }
interface Message {
  id: string;
  group_id: string;
  user_id: string;
  username: string;
  content: string;
  created_at: string;
}

const ChatPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("chat_groups").select("*").order("created_at").then(({ data }) => {
      if (data && data.length) {
        setGroups(data);
        setActiveGroupId((prev) => prev ?? data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeGroupId) return;
    supabase
      .from("chat_messages")
      .select("*")
      .eq("group_id", activeGroupId)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => setMessages(data || []));

    const channel = supabase
      .channel(`chat-${activeGroupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `group_id=eq.${activeGroupId}` },
        (payload) => setMessages((m) => [...m, payload.new as Message]),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [activeGroupId]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate("/auth"); return; }
    if (!text.trim() || !activeGroupId) return;
    const username = profile?.username || profile?.name || user.email?.split("@")[0] || "user";
    const { error } = await supabase.from("chat_messages").insert({
      group_id: activeGroupId,
      user_id: user.id,
      username,
      content: text.trim(),
    });
    if (error) toast.error(error.message);
    else setText("");
  };

  if (!user) {
    return (
      <Layout showCommunityHelp={false}>
        <div className="container mx-auto py-12 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Sign in to join the community</h2>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </Layout>
    );
  }

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  return (
    <Layout showCommunityHelp={false}>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6">Community Chat</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 md:col-span-1">
            <h3 className="font-semibold mb-3">Groups</h3>
            <div className="space-y-1">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className={`w-full text-left px-3 py-2 rounded ${activeGroupId === g.id ? "bg-lemonade-yellow text-black" : "hover:bg-gray-100"}`}
                >
                  # {g.name}
                </button>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-3 flex flex-col h-[70vh]">
            <div className="p-4 border-b">
              <h2 className="font-bold">{activeGroup?.name || "Select a group"}</h2>
              {activeGroup?.description && <p className="text-sm text-gray-500">{activeGroup.description}</p>}
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500 mt-8">No messages yet. Say hi!</p>
              ) : messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.user_id === user.id ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8"><AvatarFallback>{m.username.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                  <div className={`max-w-[70%] px-3 py-2 rounded-lg ${m.user_id === user.id ? "bg-lemonade-yellow/40" : "bg-white border"}`}>
                    <div className="text-xs font-semibold">{m.username}</div>
                    <div className="text-sm whitespace-pre-wrap break-words">{m.content}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." maxLength={2000} />
              <Button type="submit"><Send className="h-4 w-4" /></Button>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
