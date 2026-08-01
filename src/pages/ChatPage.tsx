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

const DEFAULT_GROUPS: Group[] = [
  { id: "general", name: "General", description: "General discussion for all Lemonade fans" },
  { id: "recipes", name: "Recipes", description: "Share and discover custom lemonade recipes" },
  { id: "feedback", name: "Feedback", description: "Give feedback and suggestions for Lemonade" },
];

const ChatPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>(DEFAULT_GROUPS);
  const [activeGroupId, setActiveGroupId] = useState<string | null>("general");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("chat_groups")
      .select("*")
      .order("created_at")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setGroups(data);
          setActiveGroupId((prev) => prev ?? data[0].id);
        } else {
          setGroups(DEFAULT_GROUPS);
          setActiveGroupId((prev) => prev ?? DEFAULT_GROUPS[0].id);
        }
      }, () => {
        setGroups(DEFAULT_GROUPS);
        setActiveGroupId((prev) => prev ?? DEFAULT_GROUPS[0].id);
      });
  }, []);

  useEffect(() => {
    if (!activeGroupId) return;

    const getLocalMessages = (): Message[] => {
      try {
        const stored = localStorage.getItem(`chat_messages_${activeGroupId}`);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    };

    supabase
      .from("chat_messages")
      .select("*")
      .eq("group_id", activeGroupId)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data, error }) => {
        const local = getLocalMessages();
        if (!error && data) {
          const combinedMap = new Map<string, Message>();
          data.forEach((m) => combinedMap.set(m.id, m));
          local.forEach((m) => combinedMap.set(m.id, m));
          const sorted = Array.from(combinedMap.values()).sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          setMessages(sorted);
        } else {
          setMessages(local);
        }
      }, () => {
        setMessages(getLocalMessages());
      });

    const channel = supabase
      .channel(`chat-${activeGroupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `group_id=eq.${activeGroupId}` },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((m) => {
            if (m.some((msg) => msg.id === newMsg.id)) return m;
            return [...m, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeGroupId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!text.trim() || !activeGroupId) return;

    const username = profile?.username || profile?.name || user.email?.split("@")[0] || "user";
    const newMsg: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      group_id: activeGroupId,
      user_id: user.id,
      username,
      content: text.trim(),
      created_at: new Date().toISOString(),
    };

    // Optimistically add to state and backup to localStorage
    setMessages((prev) => [...prev, newMsg]);
    setText("");

    try {
      const stored = JSON.parse(localStorage.getItem(`chat_messages_${activeGroupId}`) || "[]");
      stored.push(newMsg);
      localStorage.setItem(`chat_messages_${activeGroupId}`, JSON.stringify(stored));
    } catch {}

    // Store message directly into Supabase database
    const { data, error } = await supabase.from("chat_messages").insert({
      id: newMsg.id,
      group_id: activeGroupId,
      user_id: user.id,
      username,
      content: newMsg.content,
      created_at: newMsg.created_at,
    }).select().maybeSingle();

    if (error) {
      console.log("Database message note:", error.message);
    } else if (data) {
      setMessages((prev) => prev.map((m) => (m.id === newMsg.id ? (data as Message) : m)));
    }
  };

  if (!user) {
    return (
      <Layout showCommunityHelp={false}>
        <div className="container mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">Sign in to join the community</h2>
          <Button 
            onClick={() => navigate("/auth")}
            className="bg-lemonade-yellow hover:bg-lemonade-green text-slate-950 font-semibold px-6 py-2.5 hover:scale-105 active:scale-95 transition-all shadow-md"
          >
            Sign In
          </Button>
        </div>
      </Layout>
    );
  }

  const activeGroup = groups.find((g) => g.id === activeGroupId);

  return (
    <Layout showCommunityHelp={false}>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-slate-100">Community Chat</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
            <h3 className="font-semibold mb-3 text-slate-900 dark:text-slate-100">Groups</h3>
            <div className="space-y-1">
              {groups.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all ${
                    activeGroupId === g.id 
                      ? "bg-lemonade-yellow text-slate-950 font-semibold shadow-sm" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  # {g.name}
                </button>
              ))}
            </div>
          </Card>

          <Card className="md:col-span-3 flex flex-col h-[70vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/90">
              <h2 className="font-bold text-slate-900 dark:text-slate-100">{activeGroup?.name || "Select a group"}</h2>
              {activeGroup?.description && <p className="text-sm text-slate-500 dark:text-slate-400">{activeGroup.description}</p>}
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/60 dark:bg-slate-950/80 space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-slate-500 dark:text-slate-400 mt-8 font-medium">No messages yet. Say hi!</p>
              ) : messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.user_id === user.id ? "flex-row-reverse" : ""}`}>
                  <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700"><AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold">{m.username.charAt(0).toUpperCase()}</AvatarFallback></Avatar>
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${m.user_id === user.id ? "bg-lemonade-yellow text-slate-950 font-medium shadow-sm" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"}`}>
                    <div className="text-xs font-semibold mb-0.5 opacity-80">{m.username}</div>
                    <div className="text-sm whitespace-pre-wrap break-words">{m.content}</div>
                    <div className="text-[10px] opacity-70 mt-1 text-right">{new Date(m.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
              <Input 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Type a message..." 
                maxLength={2000} 
                className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
              />
              <Button 
                type="submit"
                className="bg-lemonade-yellow hover:bg-lemonade-green text-slate-950 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
