CREATE TABLE public.news_banner_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  link_title text,
  link_url text,
  lucide_icon text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.news_banner_items TO anon;
GRANT SELECT ON public.news_banner_items TO authenticated;
GRANT ALL ON public.news_banner_items TO service_role;

ALTER TABLE public.news_banner_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "news_banner_public_read" ON public.news_banner_items
  FOR SELECT USING (true);

CREATE POLICY "news_banner_admin_write" ON public.news_banner_items
  FOR ALL TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

CREATE TRIGGER update_news_banner_items_updated_at
  BEFORE UPDATE ON public.news_banner_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();