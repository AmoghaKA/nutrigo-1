/**
 * Database Migration: Add Comparisons Table
 * Run this migration in your Supabase SQL editor to create the comparisons table
 */

-- Create comparisons table
CREATE TABLE IF NOT EXISTS public.comparisons (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_1_id TEXT NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  product_2_id TEXT NOT NULL REFERENCES public.scans(id) ON DELETE CASCADE,
  winner_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_comparisons_user_id ON public.comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_product_1_id ON public.comparisons(product_1_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_product_2_id ON public.comparisons(product_2_id);
CREATE INDEX IF NOT EXISTS idx_comparisons_created_at ON public.comparisons(created_at DESC);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE public.comparisons ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own comparisons
CREATE POLICY "Users can only view their own comparisons"
  ON public.comparisons FOR SELECT
  USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own comparisons
CREATE POLICY "Users can insert their own comparisons"
  ON public.comparisons FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own comparisons
CREATE POLICY "Users can delete their own comparisons"
  ON public.comparisons FOR DELETE
  USING (auth.uid()::text = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_comparisons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_comparisons_updated_at
  BEFORE UPDATE ON public.comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_comparisons_updated_at();
