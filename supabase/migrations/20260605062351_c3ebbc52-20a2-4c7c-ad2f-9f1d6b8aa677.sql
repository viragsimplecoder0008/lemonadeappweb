
-- 1. Create role enum
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'employee', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Grants
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- 4. Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Security definer functions
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_employee_or_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','employee')
  )
$$;

-- 6. RLS policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Replace insecure profile policies that trusted role column / email
DROP POLICY IF EXISTS "Employees can update VIP status" ON public.profiles;
CREATE POLICY "Employees can update VIP status" ON public.profiles
  FOR UPDATE TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Employees can view all profiles" ON public.profiles;
CREATE POLICY "Employees can view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.is_employee_or_admin(auth.uid()));

-- 8. Allow employees/admins to view all orders (for employee dashboard)
DROP POLICY IF EXISTS "Employees can view all orders" ON public.orders;
CREATE POLICY "Employees can view all orders" ON public.orders
  FOR SELECT TO authenticated
  USING (public.is_employee_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Employees can update all orders" ON public.orders;
CREATE POLICY "Employees can update all orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.is_employee_or_admin(auth.uid()))
  WITH CHECK (public.is_employee_or_admin(auth.uid()));

DROP POLICY IF EXISTS "Employees can view all order items" ON public.order_items;
CREATE POLICY "Employees can view all order items" ON public.order_items
  FOR SELECT TO authenticated
  USING (public.is_employee_or_admin(auth.uid()));
