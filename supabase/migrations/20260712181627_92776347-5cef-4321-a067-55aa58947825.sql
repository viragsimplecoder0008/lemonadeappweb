
-- Profile extras
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS lemons INTEGER NOT NULL DEFAULT 0;

-- Orders: custom order support
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS custom_details JSONB;

-- PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products_admin_write" ON public.products FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- COUPONS
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 100),
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.coupons TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.coupons TO authenticated;
GRANT ALL ON public.coupons TO service_role;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupons_read_active" ON public.coupons FOR SELECT
  USING (active = true AND (expires_at IS NULL OR expires_at > now()));
CREATE POLICY "coupons_admin_all" ON public.coupons FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- CHAT GROUPS
CREATE TABLE IF NOT EXISTS public.chat_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.chat_groups TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.chat_groups TO authenticated;
GRANT ALL ON public.chat_groups TO service_role;
ALTER TABLE public.chat_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_groups_read" ON public.chat_groups FOR SELECT USING (true);
CREATE POLICY "chat_groups_admin_write" ON public.chat_groups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- CHAT MESSAGES
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.chat_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.chat_messages TO authenticated;
GRANT INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "chat_messages_read_authed" ON public.chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "chat_messages_insert_own" ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "chat_messages_delete_own_or_admin" ON public.chat_messages FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- LEMON TRANSACTIONS
CREATE TABLE IF NOT EXISTS public.lemon_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.lemon_transactions TO authenticated;
GRANT ALL ON public.lemon_transactions TO service_role;
ALTER TABLE public.lemon_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lemon_tx_read_own_or_staff" ON public.lemon_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_employee_or_admin(auth.uid()));

-- Redeem lemons securely (1 lemon = 1 INR credit? use fixed rate)
CREATE OR REPLACE FUNCTION public.redeem_lemons(_amount INTEGER, _reason TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  SELECT lemons INTO current_balance FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  IF current_balance < _amount THEN RAISE EXCEPTION 'Insufficient lemons'; END IF;
  UPDATE public.profiles SET lemons = lemons - _amount, updated_at = now() WHERE id = auth.uid();
  INSERT INTO public.lemon_transactions(user_id, amount, reason) VALUES (auth.uid(), -_amount, _reason);
  RETURN current_balance - _amount;
END; $$;

CREATE OR REPLACE FUNCTION public.award_lemons(_user_id UUID, _amount INTEGER, _reason TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  IF NOT public.is_employee_or_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  IF _amount <= 0 THEN RAISE EXCEPTION 'Amount must be positive'; END IF;
  UPDATE public.profiles SET lemons = lemons + _amount, updated_at = now()
   WHERE id = _user_id RETURNING lemons INTO new_balance;
  INSERT INTO public.lemon_transactions(user_id, amount, reason)
    VALUES (_user_id, _amount, _reason);
  RETURN new_balance;
END; $$;

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_products_updated ON public.products;
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
DROP TRIGGER IF EXISTS trg_coupons_updated ON public.coupons;
CREATE TRIGGER trg_coupons_updated BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed products (idempotent)
INSERT INTO public.products (id, name, description, price, image_url, category, in_stock) VALUES
  ('classic', 'Classic Lemonade', 'Refreshing traditional lemonade made with fresh lemons.', 60, '/classic-lemonade.jpg', 'classic', true),
  ('mint', 'Mint Lemonade', 'Cool mint lemonade for a refreshing burst.', 80, '/mint-lemonade.jpg', 'classic', true),
  ('ginger', 'Ginger Lemonade', 'Zesty ginger lemonade with a spicy kick.', 90, '/ginger-lemonade.jpg', 'speciality', true),
  ('strawberry', 'Strawberry Lemonade', 'Sweet strawberry blend.', 110, '/strawberry-lemonade.jpg', 'speciality', true),
  ('blueberry', 'Blueberry Lemonade', 'Rich blueberry infusion.', 120, '/blueberry-lemonade.jpg', 'speciality', true),
  ('lavender', 'Lavender Lemonade', 'Floral lavender-infused lemonade.', 150, '/lavender-lemonade.jpg', 'golden', true),
  ('rose', 'Rose Lemonade', 'Delicate rose-petal lemonade.', 150, '/rose-lemonade.jpg', 'golden', true),
  ('cola', 'Cola Lemonade', 'Cola-inspired premium blend.', 160, '/cola-lemonade.jpg', 'golden', true)
ON CONFLICT (id) DO NOTHING;

-- Seed a default chat group
INSERT INTO public.chat_groups (name, description) VALUES
  ('General', 'General discussion for all Lemonade fans'),
  ('Recipes', 'Share and discuss lemonade recipes'),
  ('Feedback', 'Give feedback and suggestions')
ON CONFLICT (name) DO NOTHING;
