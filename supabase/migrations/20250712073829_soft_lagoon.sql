/*
  # Add timeframe to recommendations

  1. New Columns
    - `timeframe` (integer) - Duration in months for the recommendation
      - NOT NULL with DEFAULT 3 (3 months)
      - CHECK constraint to ensure only 3, 6, or 12 months allowed
  
  2. Changes
    - All existing recommendations will default to 3 months timeframe
    - Future recommendations must specify a valid timeframe
*/

ALTER TABLE public.recommendations 
ADD COLUMN timeframe INTEGER NOT NULL DEFAULT 3 CHECK (timeframe IN (3, 6, 12));