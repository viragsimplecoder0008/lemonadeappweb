ALTER TABLE public.news_banner_items REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news_banner_items;