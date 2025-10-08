-- Add funeral service fields to memorials table
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS funeral_date DATE,
ADD COLUMN IF NOT EXISTS funeral_time TIME,
ADD COLUMN IF NOT EXISTS funeral_location TEXT;

-- Add background_theme and custom_background_url fields to memorials table
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS background_theme TEXT DEFAULT 'nature-roses',
ADD COLUMN IF NOT EXISTS custom_background_url TEXT;

-- Add favorites fields to memorials table
ALTER TABLE memorials
ADD COLUMN IF NOT EXISTS favorite_quote TEXT,
ADD COLUMN IF NOT EXISTS favorite_song TEXT,
ADD COLUMN IF NOT EXISTS hobbies TEXT[],
ADD COLUMN IF NOT EXISTS personal_traits TEXT[];

-- Create memorial_events table
CREATE TABLE IF NOT EXISTS memorial_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memorial_id UUID NOT NULL REFERENCES memorials(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  event_location TEXT,
  event_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for memorial_events
CREATE INDEX IF NOT EXISTS idx_memorial_events_memorial_id ON memorial_events(memorial_id);

-- Enable RLS on memorial_events
ALTER TABLE memorial_events ENABLE ROW LEVEL SECURITY;

-- Create policies for memorial_events
CREATE POLICY "Anyone can view memorial events"
  ON memorial_events FOR SELECT
  USING (true);

CREATE POLICY "Memorial owners can insert events"
  ON memorial_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE memorials.id = memorial_events.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

CREATE POLICY "Memorial owners can update events"
  ON memorial_events FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE memorials.id = memorial_events.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

CREATE POLICY "Memorial owners can delete events"
  ON memorial_events FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM memorials
      WHERE memorials.id = memorial_events.memorial_id
      AND memorials.user_id = auth.uid()
    )
  );

-- Add updated_at trigger for memorial_events
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_memorial_events_updated_at BEFORE UPDATE ON memorial_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
