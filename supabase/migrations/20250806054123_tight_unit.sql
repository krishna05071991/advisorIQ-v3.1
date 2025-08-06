/*
  # Fix Database Schema Issues

  1. Missing Column
    - Add `profile_image` column to `advisors` table to store profile image URLs

  2. Check Constraints
    - Ensure `recommendations` table has proper confidence_level constraint (1-100)
    - Add missing columns if needed

  3. Security
    - Maintain existing RLS policies
    - No changes to user access patterns
*/

-- Add profile_image column to advisors table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'advisors' AND column_name = 'profile_image'
  ) THEN
    ALTER TABLE advisors ADD COLUMN profile_image text;
  END IF;
END $$;

-- Ensure recommendations table exists with proper structure
CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid REFERENCES advisors(id) ON DELETE CASCADE,
  stock_symbol text NOT NULL,
  action text NOT NULL CHECK (action IN ('buy', 'sell', 'hold')),
  target_price decimal NOT NULL CHECK (target_price > 0),
  reasoning text NOT NULL,
  confidence_level integer NOT NULL CHECK (confidence_level >= 1 AND confidence_level <= 100),
  status text NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'successful', 'unsuccessful')),
  outcome_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on recommendations table
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for recommendations if they don't exist
DO $$
BEGIN
  -- Policy for advisors to manage their own recommendations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recommendations' AND policyname = 'advisors_manage_own_recommendations'
  ) THEN
    CREATE POLICY "advisors_manage_own_recommendations"
      ON recommendations
      FOR ALL
      TO authenticated
      USING (
        advisor_id IN (
          SELECT id FROM advisors WHERE user_id = auth.uid()
        )
      )
      WITH CHECK (
        advisor_id IN (
          SELECT id FROM advisors WHERE user_id = auth.uid()
        )
      );
  END IF;

  -- Policy for admin users to view all recommendations
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recommendations' AND policyname = 'admin_view_all_recommendations'
  ) THEN
    CREATE POLICY "admin_view_all_recommendations"
      ON recommendations
      FOR SELECT
      TO authenticated
      USING (
        auth.email() IN ('admin@gmail.com')
      );
  END IF;
END $$;

-- Ensure advisors table exists with proper structure
CREATE TABLE IF NOT EXISTS advisors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  specialization text,
  bio text,
  profile_image text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on advisors table
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;

-- Create advisor performance view for analytics
CREATE OR REPLACE VIEW advisor_performance AS
SELECT 
  a.id as advisor_id,
  a.name,
  a.email,
  a.specialization,
  COALESCE(r.total_recommendations, 0) as total_recommendations,
  COALESCE(r.successful_recommendations, 0) as successful_recommendations,
  COALESCE(r.unsuccessful_recommendations, 0) as unsuccessful_recommendations,
  COALESCE(r.ongoing_recommendations, 0) as ongoing_recommendations,
  CASE 
    WHEN COALESCE(r.total_recommendations, 0) > 0 
    THEN (COALESCE(r.successful_recommendations, 0)::decimal / r.total_recommendations * 100)
    ELSE 0 
  END as success_rate,
  a.created_at,
  a.updated_at
FROM advisors a
LEFT JOIN (
  SELECT 
    advisor_id,
    COUNT(*) as total_recommendations,
    COUNT(CASE WHEN status = 'successful' THEN 1 END) as successful_recommendations,
    COUNT(CASE WHEN status = 'unsuccessful' THEN 1 END) as unsuccessful_recommendations,
    COUNT(CASE WHEN status = 'ongoing' THEN 1 END) as ongoing_recommendations
  FROM recommendations
  GROUP BY advisor_id
) r ON a.id = r.advisor_id
WHERE a.is_active = true;

-- Grant access to the view
GRANT SELECT ON advisor_performance TO authenticated;