-- ============================================
-- Fix invites table foreign key constraint
-- Change invited_by to reference auth.users instead of profiles
-- This is more reliable since every authenticated user has an auth.users record
-- ============================================

-- First, drop all policies that depend on invited_by column
DROP POLICY IF EXISTS "Users can view own invites" ON public.invites;
DROP POLICY IF EXISTS "Users can create invites" ON public.invites;
DROP POLICY IF EXISTS "Users can update own invites" ON public.invites;
DROP POLICY IF EXISTS "Users can delete own invites" ON public.invites;
DROP POLICY IF EXISTS "Admins can view all invites" ON public.invites;
DROP POLICY IF EXISTS "Admins can manage all invites" ON public.invites;

-- Drop the existing foreign key constraint
ALTER TABLE public.invites 
  DROP CONSTRAINT IF EXISTS invites_invited_by_fkey;

-- Note: The column type is already uuid, so we only need to change the foreign key reference
-- No need to alter the column type

-- Add new foreign key constraint to auth.users
ALTER TABLE public.invites 
  ADD CONSTRAINT invites_invited_by_fkey 
  FOREIGN KEY (invited_by) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Recreate RLS policies (they were dropped earlier)
-- Policy: Users can view invites they created
CREATE POLICY "Users can view own invites" ON public.invites
  FOR SELECT USING (invited_by = auth.uid());

-- Policy: Users can create invites
CREATE POLICY "Users can create invites" ON public.invites
  FOR INSERT WITH CHECK (invited_by = auth.uid());

-- Policy: Users can update invites they created
CREATE POLICY "Users can update own invites" ON public.invites
  FOR UPDATE USING (invited_by = auth.uid());

-- Policy: Users can delete invites they created
CREATE POLICY "Users can delete own invites" ON public.invites
  FOR DELETE USING (invited_by = auth.uid());

-- Policy: Admins can view all invites (using is_admin function)
CREATE POLICY "Admins can view all invites" ON public.invites
  FOR SELECT USING (public.is_admin());

-- Policy: Admins can manage all invites
CREATE POLICY "Admins can manage all invites" ON public.invites
  FOR ALL USING (public.is_admin());

-- Update the comment
COMMENT ON COLUMN public.invites.invited_by IS 'User ID from auth.users who created the invitation';

-- Update get_inviter_name function to work with new foreign key
CREATE OR REPLACE FUNCTION public.get_inviter_name(invite_token_param text)
RETURNS text AS $$
DECLARE
  inviter_name text;
  inviter_user_id uuid;
BEGIN
  -- Get inviter user ID from invite (now references auth.users)
  SELECT invited_by INTO inviter_user_id
  FROM public.invites
  WHERE token = invite_token_param AND used = false
  LIMIT 1;

  -- Get inviter name from profile (using user_id from auth.users)
  IF inviter_user_id IS NOT NULL THEN
    SELECT full_name INTO inviter_name
    FROM public.profiles
    WHERE id = inviter_user_id;
  END IF;

  RETURN COALESCE(inviter_name, 'a team member');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.get_inviter_name(text) TO anon, authenticated;

-- Also update profiles.invited_by to reference auth.users for consistency
-- Note: We only need to change the foreign key, not the column type (it's already uuid)
ALTER TABLE public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_invited_by_fkey;

ALTER TABLE public.profiles 
  ADD CONSTRAINT profiles_invited_by_fkey 
  FOREIGN KEY (invited_by) 
  REFERENCES auth.users(id) 
  ON DELETE SET NULL;

-- Update handle_new_user function to work with new foreign key structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_full_name text;
  user_phone text;
  user_email text;
  user_invited_by uuid;
  invite_token text;
BEGIN
  -- Get data from user metadata
  user_full_name := COALESCE((NEW.raw_user_meta_data->>'full_name')::text, '');
  user_phone := COALESCE((NEW.raw_user_meta_data->>'phone')::text, NULL);
  user_email := COALESCE(NEW.email, '');
  invite_token := COALESCE((NEW.raw_user_meta_data->>'invite_token')::text, NULL);

  -- If invite token exists, find the inviter (now from auth.users) and mark invite as used
  IF invite_token IS NOT NULL THEN
    SELECT invited_by INTO user_invited_by
    FROM public.invites
    WHERE token = invite_token AND used = false AND (expires_at IS NULL OR expires_at > now())
    LIMIT 1;

    -- Mark invite as used if found
    IF user_invited_by IS NOT NULL THEN
      UPDATE public.invites
      SET used = true, used_at = now(), used_by = NEW.id
      WHERE token = invite_token;
    END IF;
  END IF;

  -- Create profile in profiles table
  INSERT INTO public.profiles (id, role, full_name, email, phone, invited_by)
  VALUES (
    NEW.id,
    'client', -- Default role for new users
    user_full_name,
    user_email,
    user_phone,
    user_invited_by  -- Now references auth.users(id)
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create record in clients table as well
  INSERT INTO public.clients (id, name, email, phone, app_role)
  VALUES (
    NEW.id,
    user_full_name,
    user_email,
    user_phone,
    'Viewer' -- Default role in the application
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

