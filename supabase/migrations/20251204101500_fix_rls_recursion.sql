-- ============================================
-- Fix RLS Recursion Issue in profiles table
-- ============================================

-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Recreate the policy using the is_admin() function which uses SECURITY DEFINER
-- This avoids recursion because the function executes with elevated privileges
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (public.is_admin());

-- Also fix the invites table policy that has the same issue
DROP POLICY IF EXISTS "Admins can view all invites" ON public.invites;

-- Recreate using is_admin() function
CREATE POLICY "Admins can view all invites" ON public.invites
  FOR SELECT USING (public.is_admin());

-- Add policy for admins to manage invites
CREATE POLICY "Admins can manage all invites" ON public.invites
  FOR ALL USING (public.is_admin());

-- Create a function to get inviter name for invite validation
-- This function uses SECURITY DEFINER to bypass RLS safely
CREATE OR REPLACE FUNCTION public.get_inviter_name(invite_token_param text)
RETURNS text AS $$
DECLARE
  inviter_name text;
  inviter_id uuid;
BEGIN
  -- Get inviter ID from invite
  SELECT invited_by INTO inviter_id
  FROM public.invites
  WHERE token = invite_token_param AND used = false
  LIMIT 1;

  -- Get inviter name from profile
  IF inviter_id IS NOT NULL THEN
    SELECT full_name INTO inviter_name
    FROM public.profiles
    WHERE id = inviter_id;
  END IF;

  RETURN COALESCE(inviter_name, 'a team member');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_inviter_name(text) TO anon, authenticated;

