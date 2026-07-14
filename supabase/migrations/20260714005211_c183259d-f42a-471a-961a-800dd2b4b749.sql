
-- Lock down SECURITY DEFINER functions
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE ALL ON FUNCTION public.is_employee_or_admin(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_employee_or_admin(uuid) TO authenticated;

REVOKE ALL ON FUNCTION public.apply_for_vip(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.apply_for_vip(text) TO authenticated;

REVOKE ALL ON FUNCTION public.redeem_lemons(integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_lemons(integer, text) TO authenticated;

REVOKE ALL ON FUNCTION public.award_lemons(uuid, integer, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.award_lemons(uuid, integer, text) TO authenticated;

-- Enforce order_items ownership integrity
DELETE FROM public.order_items WHERE order_id IS NULL;
ALTER TABLE public.order_items
  ALTER COLUMN order_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'order_items_order_id_fkey'
  ) THEN
    ALTER TABLE public.order_items
      ADD CONSTRAINT order_items_order_id_fkey
      FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
  END IF;
END $$;
