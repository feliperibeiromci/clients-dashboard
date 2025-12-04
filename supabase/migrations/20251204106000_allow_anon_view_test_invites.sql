-- ============================================
-- Allow anonymous users to view test invites
-- Test invites have invited_by = NULL
-- ============================================

-- Drop existing policies that might block anon users
DROP POLICY IF EXISTS "Users can view own invites" ON public.invites;
DROP POLICY IF EXISTS "Users can view own invites or test invites" ON public.invites;

-- Create policy that allows:
-- 1. Authenticated users to view their own invites (invited_by = auth.uid())
-- 2. Anyone (including anon) to view test invites (invited_by IS NULL)
-- This is critical for the signup page to validate invite tokens
CREATE POLICY "Users can view own invites or test invites" ON public.invites
  FOR SELECT USING (
    invited_by = auth.uid() OR invited_by IS NULL
  );

-- Also update the update policy to allow updating test invites (for marking as used)
DROP POLICY IF EXISTS "Users can update own invites" ON public.invites;
CREATE POLICY "Users can update own invites or test invites" ON public.invites
  FOR UPDATE USING (
    invited_by = auth.uid() OR invited_by IS NULL
  );

