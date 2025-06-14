
-- Enable RLS on intoxications table
ALTER TABLE public.intoxications ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to intoxications (anyone can view)
CREATE POLICY "Anyone can view intoxications" 
  ON public.intoxications 
  FOR SELECT 
  USING (true);

-- Create policy for admin users to manage intoxications
CREATE POLICY "Admins can manage intoxications" 
  ON public.intoxications 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Enable RLS on high_alert_medications table
ALTER TABLE public.high_alert_medications ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to high alert medications (anyone can view)
CREATE POLICY "Anyone can view high alert medications" 
  ON public.high_alert_medications 
  FOR SELECT 
  USING (true);

-- Create policy for admin users to manage high alert medications
CREATE POLICY "Admins can manage high alert medications" 
  ON public.high_alert_medications 
  FOR ALL 
  USING (public.is_admin(auth.uid()));
