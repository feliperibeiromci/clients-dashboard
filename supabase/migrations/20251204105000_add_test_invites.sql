-- ============================================
-- Add support for test invites (no auth required)
-- ============================================

-- Make invited_by nullable to allow test invites
ALTER TABLE public.invites 
  ALTER COLUMN invited_by DROP NOT NULL;

-- Update foreign key to allow NULL
ALTER TABLE public.invites 
  DROP CONSTRAINT IF EXISTS invites_invited_by_fkey;

ALTER TABLE public.invites 
  ADD CONSTRAINT invites_invited_by_fkey 
  FOREIGN KEY (invited_by) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Update RLS policies to allow creating invites without invited_by (for test invites)
DROP POLICY IF EXISTS "Users can create invites" ON public.invites;
CREATE POLICY "Users can create invites" ON public.invites
  FOR INSERT WITH CHECK (
    invited_by = auth.uid() OR invited_by IS NULL  -- Allow NULL for test invites
  );

-- Allow viewing invites without invited_by (for test invites)
DROP POLICY IF EXISTS "Users can view own invites" ON public.invites;
CREATE POLICY "Users can view own invites" ON public.invites
  FOR SELECT USING (
    invited_by = auth.uid() OR invited_by IS NULL  -- Allow viewing test invites
  );

-- Create a function to generate test invites (no auth required)
CREATE OR REPLACE FUNCTION public.create_test_invite()
RETURNS json AS $$
DECLARE
  new_token text;
  invite_id uuid;
BEGIN
  -- Generate a random token
  new_token := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 16));
  
  -- Create invite without invited_by (test invite)
  INSERT INTO public.invites (token, invited_by, expires_at)
  VALUES (new_token, NULL, NULL)  -- NULL expires_at = never expires
  RETURNING id, token INTO invite_id, new_token;
  
  RETURN json_build_object(
    'id', invite_id,
    'token', new_token
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon users (for testing)
GRANT EXECUTE ON FUNCTION public.create_test_invite() TO anon, authenticated;

COMMENT ON FUNCTION public.create_test_invite() IS 'Creates a test invite that never expires and requires no authentication';

-- Update get_inviter_name function to work with test invites (no invited_by)
CREATE OR REPLACE FUNCTION public.get_inviter_name(invite_token_param text)
RETURNS text AS $$
DECLARE
  inviter_name text;
  inviter_user_id uuid;
BEGIN
  -- Get inviter user ID from invite (now references auth.users, or NULL for test invites)
  SELECT invited_by INTO inviter_user_id
  FROM public.invites
  WHERE token = invite_token_param AND used = false
  LIMIT 1;

  -- Get inviter name from profile (using user_id from auth.users)
  -- If invited_by is NULL, it's a test invite
  IF inviter_user_id IS NOT NULL THEN
    SELECT full_name INTO inviter_name
    FROM public.profiles
    WHERE id = inviter_user_id;
  END IF;

  -- Return inviter name, or default message for test invites
  RETURN COALESCE(inviter_name, 'the MCI Analytics team');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_inviter_name(text) TO anon, authenticated;

