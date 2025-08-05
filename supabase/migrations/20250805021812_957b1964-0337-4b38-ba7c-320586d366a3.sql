-- Create order progress tracking table
CREATE TABLE public.order_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  making_progress INTEGER NOT NULL DEFAULT 0 CHECK (making_progress >= 0 AND making_progress <= 100),
  putting_in_cup_progress INTEGER NOT NULL DEFAULT 0 CHECK (putting_in_cup_progress >= 0 AND putting_in_cup_progress <= 100),
  delivering_progress INTEGER NOT NULL DEFAULT 0 CHECK (delivering_progress >= 0 AND delivering_progress <= 100),
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.order_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for order progress
CREATE POLICY "Anyone can view order progress" 
ON public.order_progress 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create order progress" 
ON public.order_progress 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update order progress" 
ON public.order_progress 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_order_progress_updated_at
BEFORE UPDATE ON public.order_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();