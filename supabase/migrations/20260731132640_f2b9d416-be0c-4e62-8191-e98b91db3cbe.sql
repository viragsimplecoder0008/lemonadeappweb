DROP POLICY IF EXISTS "Order owner or staff can create progress" ON public.order_progress;
DROP POLICY IF EXISTS "Order owner or staff can update progress" ON public.order_progress;

CREATE POLICY "Order owner or staff can create progress"
ON public.order_progress
FOR INSERT TO authenticated
WITH CHECK (
  (
    public.is_employee_or_admin(auth.uid())
    OR (
      EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_progress.order_id AND o.user_id = auth.uid())
      AND (updated_by IS NULL OR updated_by = auth.uid())
    )
  )
);

CREATE POLICY "Order owner or staff can update progress"
ON public.order_progress
FOR UPDATE TO authenticated
USING (
  public.is_employee_or_admin(auth.uid())
  OR EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_progress.order_id AND o.user_id = auth.uid())
)
WITH CHECK (
  public.is_employee_or_admin(auth.uid())
  OR (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_progress.order_id AND o.user_id = auth.uid())
    AND (updated_by IS NULL OR updated_by = auth.uid())
  )
);