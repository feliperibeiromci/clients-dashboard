-- ============================================
-- Add INSERT policy for profiles table and ensure tables exist
-- ============================================

-- Ensure clients table exists (required for foreign key)
-- This is a safety check in case the table doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'clients') THEN
    CREATE TABLE IF NOT EXISTS public.clients (
      id uuid PRIMARY KEY,
      name text,
      email text,
      phone text,
      app_role text DEFAULT 'Viewer',
      created_at timestamp with time zone DEFAULT now()
    );
  END IF;
END $$;

-- Ensure profiles table has all required columns
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

-- Policy: Allow system (trigger) to insert profiles
-- Since handle_new_user uses SECURITY DEFINER, it runs with elevated privileges
-- But we still need a policy for RLS to allow the insert
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "System can insert profiles" ON public.profiles
  FOR INSERT 
  WITH CHECK (true);

-- Also ensure clients table has INSERT policy if RLS is enabled
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE t.schemaname = 'public' 
    AND t.tablename = 'clients'
    AND c.relrowsecurity = true
  ) THEN
    -- RLS is enabled, add insert policy
    DROP POLICY IF EXISTS "System can insert clients" ON public.clients;
    CREATE POLICY "System can insert clients" ON public.clients
      FOR INSERT 
      WITH CHECK (true);
  END IF;
END $$;

