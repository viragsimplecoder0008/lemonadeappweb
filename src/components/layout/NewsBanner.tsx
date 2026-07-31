import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NewsBannerProps {
  onClose?: () => void;
}

export interface NewsBannerItem {
  id: string;
  title: string;
  link_title: string | null;
  link_url: string | null;
  lucide_icon: string | null;
  sort_order: number;
  active: boolean;
}

const DynamicIcon: React.FC<{ name: string | null; className?: string }> = ({ name, className }) => {
  if (!name) return null;
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
  if (!Icon) return null;
  return <Icon className={className} />;
};

const NewsItems: React.FC<{ items: NewsBannerItem[] }> = ({ items }) => (
  <div className="flex items-center gap-4 whitespace-nowrap px-6">
    <span className="bg-slate-950 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
      <Sparkles className="h-3 w-3 text-amber-400" /> NEWS
    </span>
    {items.map((item) => (
      <React.Fragment key={item.id}>
        <span className="font-semibold flex items-center gap-1">
          <DynamicIcon name={item.lucide_icon} className="h-3.5 w-3.5 inline" />
          {item.title}
        </span>
        {item.link_title && item.link_url && (
          item.link_url.startsWith("http") ? (
            <a
              href={item.link_url}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-slate-800 transition-colors font-bold"
            >
              {item.link_title}
            </a>
          ) : (
            <Link to={item.link_url} className="underline hover:text-slate-800 transition-colors font-bold">
              {item.link_title}
            </Link>
          )
        )}
        <span className="opacity-60 text-slate-700">•</span>
      </React.Fragment>
    ))}
  </div>
);

const NewsBanner: React.FC<NewsBannerProps> = ({ onClose }) => {
  const [items, setItems] = useState<NewsBannerItem[]>([]);

  const load = React.useCallback(async () => {
    const { data } = await supabase
      .from("news_banner_items")
      .select("id,title,link_title,link_url,lucide_icon,sort_order,active")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    setItems((data as NewsBannerItem[]) ?? []);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel("news-banner-items")
      .on("postgres_changes", { event: "*", schema: "public", table: "news_banner_items" }, () => load())
      .subscribe();

    const onManual = () => load();
    window.addEventListener("news-banner-updated", onManual);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("news-banner-updated", onManual);
    };
  }, [load]);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 via-lemonade-yellow to-amber-500 text-slate-950 h-9 text-xs md:text-sm font-medium shadow-md flex items-center justify-between border-b border-amber-400/60 overflow-hidden">
      <style>{`
        @keyframes marqueeSpin {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-spin {
          display: flex;
          width: max-content;
          animation: marqueeSpin 22s linear infinite;
        }
        .animate-marquee-spin:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="overflow-hidden flex-1 relative flex items-center">
        <div className="animate-marquee-spin">
          <NewsItems items={items} />
          <NewsItems items={items} />
          <NewsItems items={items} />
          <NewsItems items={items} />
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 hover:bg-amber-600/30 rounded-full transition-colors ml-2 mr-3 flex-shrink-0 z-10 bg-amber-400/90 shadow-sm border border-amber-500/40"
          aria-label="Close news banner"
        >
          <X className="h-4 w-4 text-slate-950" />
        </button>
      )}
    </div>
  );
};

export default NewsBanner;
