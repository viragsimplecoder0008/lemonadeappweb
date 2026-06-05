
-- profiles: remove public SELECT
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Prevent role self-escalation
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role IS NOT DISTINCT FROM (SELECT role FROM public.profiles WHERE id = auth.uid())
  AND vip_status IS NOT DISTINCT FROM (SELECT vip_status FROM public.profiles WHERE id = auth.uid())
);

-- order_progress: restrict writes
DROP POLICY IF EXISTS "Authenticated users can create order progress" ON public.order_progress;
DROP POLICY IF EXISTS "Authenticated users can update order progress" ON public.order_progress;

CREATE POLICY "Order owner or staff can create progress"
ON public.order_progress FOR INSERT
TO authenticated
WITH CHECK (
  public.is_employee_or_admin(auth.uid())
  OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

CREATE POLICY "Order owner or staff can update progress"
ON public.order_progress FOR UPDATE
TO authenticated
USING (
  public.is_employee_or_admin(auth.uid())
  OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
)
WITH CHECK (
  public.is_employee_or_admin(auth.uid())
  OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);

-- Restrict order_progress SELECT (was public)
DROP POLICY IF EXISTS "Anyone can view order progress" ON public.order_progress;

CREATE POLICY "Owner or staff can view order progress"
ON public.order_progress FOR SELECT
TO authenticated
USING (
  public.is_employee_or_admin(auth.uid())
  OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
);
