import React, { useEffect, useRef, useState } from "react";
import { MessageCircleQuestion, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllDocs } from "@/data/docs";
import { faqs } from "@/data/faq";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

import MarkdownRenderer from "@/components/docs/MarkdownRenderer";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
}

const HelpChat: React.FC = () => {
  const isMobile = useIsMobile();
  const { session } = useAuth();
  const { cartItems, getTotalPrice } = useCart();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content: "Hi! I'm **Lemonade Help**. Ask me about our flavors, your orders, coupons, VIP perks or anything else. 🍋",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, loading]);

  const buildClientContext = () => {
    let festivals: unknown[] = [];
    try {
      festivals = JSON.parse(localStorage.getItem("festivals") || "[]");
    } catch {
      festivals = [];
    }
    return {
      cart: cartItems.map((i) => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
        category: i.product.category,
      })),
      cartTotal: getTotalPrice(),
      festivals,
      currentFestival: Array.isArray(festivals) && festivals.length ? festivals[festivals.length - 1] : null,
      strawberryDiscount: localStorage.getItem("strawberryLemonadeDiscount") === "20",
      faq: faqs,
      docs: getAllDocs().map((d) => ({ title: d.title, content: d.content })),
      currentPage: location.pathname + location.search,
    };
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/help-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
            clientContext: buildClientContext(),
          }),
        },
      );

      if (!res.ok || !res.body) {
        const errText = res.status === 429
          ? "I'm getting a lot of questions right now — please try again in a moment."
          : res.status === 402
            ? "The help assistant is out of credits. Please contact support."
            : "Sorry, I couldn't reach the help service. Please try again.";
        setMessages((m) => [...m, { role: "assistant", content: errText }]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const data = trimmed.slice(5).trim();
          if (!data || data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const copy = [...m];
                copy[copy.length - 1] = { role: "assistant", content: assistant };
                return copy;
              });
            }
          } catch {
            /* ignore partial chunks */
          }
        }
      }
      // The assistant can edit the news banner via tools — refresh it after each reply.
      window.dispatchEvent(new Event("news-banner-updated"));
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }

  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed ${isMobile ? "bottom-40" : "bottom-20"} right-5 z-50 flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 backdrop-blur-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 px-4 py-3`}
        aria-label="Open Lemonade Help chat"
      >
        <MessageCircleQuestion className="h-5 w-5 text-lemonade-dark dark:text-lemonade-yellow animate-pulse" />
        <span className="text-sm font-semibold">Lemonade Help</span>
      </button>

      {open && (
        <div
          className={`fixed ${isMobile ? "bottom-24 left-3 right-3" : "bottom-36 right-5 w-[380px]"} z-50 flex flex-col h-[65vh] max-h-[520px] rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-900 dark:text-slate-100 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300`}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-slate-100/60 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-200/80 dark:border-slate-800 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-lemonade-green animate-pulse" />
              <span>Lemonade Help</span>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              aria-label="Close help chat"
              className="p-1 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20 dark:bg-slate-950/20 backdrop-blur-md">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl bg-lemonade-yellow px-4 py-2 text-sm text-slate-950 font-medium shadow-sm"
                      : "max-w-[90%] rounded-2xl bg-white/75 dark:bg-slate-800/75 border border-slate-200/80 dark:border-slate-700/80 px-4 py-3 text-sm text-slate-900 dark:text-slate-100 shadow-sm backdrop-blur-md"
                  }
                >
                  {m.role === "user" ? (
                    m.content
                  ) : m.content ? (
                    <MarkdownRenderer source={m.content} />
                  ) : loading ? (
                    <div className="flex items-center gap-1.5 py-1 px-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-lemonade-yellow animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-lemonade-yellow animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-lemonade-yellow animate-bounce" />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-xl">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about orders, flavors, coupons…"
              maxLength={500}
              className="bg-white/75 dark:bg-slate-800/75 text-slate-900 dark:text-slate-100 border-slate-300/80 dark:border-slate-700/80 placeholder:text-slate-400 backdrop-blur-md"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={loading}
              className="bg-lemonade-yellow hover:bg-lemonade-green text-slate-950 hover:scale-110 active:scale-95 transition-all duration-200 shadow-sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default HelpChat;
