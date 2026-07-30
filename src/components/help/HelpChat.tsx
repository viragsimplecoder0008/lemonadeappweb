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
        className={`fixed ${isMobile ? "bottom-40" : "bottom-20"} right-5 z-50 flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-lemonade-yellow px-4 py-3 shadow-lg hover:scale-105 transition-transform`}
        aria-label="Open Lemonade Help chat"
      >
        <MessageCircleQuestion className="h-5 w-5 text-lemonade-dark" />
        <span className="text-sm font-semibold text-lemonade-dark">Lemonade Help</span>
      </button>

      {open && (
        <div
          className={`fixed ${isMobile ? "bottom-24 left-3 right-3" : "bottom-36 right-5 w-[380px]"} z-50 flex flex-col h-[65vh] max-h-[520px] rounded-2xl border border-white/40 bg-white/80 backdrop-blur-xl shadow-2xl overflow-hidden`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/40">
            <div className="font-bold">Lemonade Help</div>
            <button onClick={() => setOpen(false)} aria-label="Close help chat">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl bg-lemonade-yellow px-3 py-2 text-sm text-lemonade-dark"
                      : "max-w-[95%] text-sm whitespace-pre-wrap text-foreground"
                  }
                >
                  {m.content || (loading ? "Thinking…" : "")}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 p-3 border-t border-white/40">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about orders, flavors, coupons…"
              maxLength={500}
            />
            <Button type="submit" size="icon" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default HelpChat;
