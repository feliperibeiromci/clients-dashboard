-- ============================================
-- Fix handle_new_user function to match migration
-- This ensures the function includes invited_by logic
-- ============================================

-- Update handle_new_user function to capture invited_by from invite token
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

  -- If invite token exists, find the inviter and mark invite as used
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
    user_invited_by
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

-- Ensure invited_by column exists
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

