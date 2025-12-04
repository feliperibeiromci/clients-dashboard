-- ============================================
-- Create Invites Table for User Invitations
-- ============================================

-- Create invites table
CREATE TABLE IF NOT EXISTS public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  invited_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email text,
  used boolean DEFAULT false,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  used_at timestamp with time zone,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_invites_token ON public.invites(token);
CREATE INDEX IF NOT EXISTS idx_invites_invited_by ON public.invites(invited_by);
CREATE INDEX IF NOT EXISTS idx_invites_used ON public.invites(used);

-- Enable RLS
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view invites they created
CREATE POLICY "Users can view own invites" ON public.invites
  FOR SELECT USING (invited_by = auth.uid());

-- Policy: Users can create invites
CREATE POLICY "Users can create invites" ON public.invites
  FOR INSERT WITH CHECK (invited_by = auth.uid());

-- Policy: Users can update invites they created
CREATE POLICY "Users can update own invites" ON public.invites
  FOR UPDATE USING (invited_by = auth.uid());

-- Policy: Admins can view all invites
CREATE POLICY "Admins can view all invites" ON public.invites
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add invited_by column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS invited_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Documentation
COMMENT ON TABLE public.invites IS 'User invitation tokens for signup flow';
COMMENT ON COLUMN public.invites.token IS 'Unique token used in invitation URL';
COMMENT ON COLUMN public.invites.invited_by IS 'User who created the invitation';
COMMENT ON COLUMN public.invites.used_by IS 'User who used the invitation (set when invite is used)';

