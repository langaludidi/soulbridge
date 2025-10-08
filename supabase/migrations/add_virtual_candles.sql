-- Add virtual candles table
CREATE TABLE IF NOT EXISTS public.virtual_candles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  memorial_id UUID REFERENCES public.memorials(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_virtual_candles_memorial_id ON public.virtual_candles(memorial_id);

-- Enable RLS
ALTER TABLE public.virtual_candles ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Anyone can view virtual candles" ON public.virtual_candles
  FOR SELECT USING (TRUE);

CREATE POLICY "Anyone can light a candle" ON public.virtual_candles
  FOR INSERT WITH CHECK (TRUE);
