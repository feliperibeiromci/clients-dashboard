-- ============================================
-- Functions and Triggers for Automatic Profile Creation
-- ============================================

-- 1. Create profiles table if it doesn't exist
-- Structure compatible with AuthContext that expects: id, client_id, role, created_at
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  full_name text,
  email text,
  phone text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update only their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 2. Function to automatically create profile when user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  user_full_name text;
  user_phone text;
  user_email text;
BEGIN
  -- Get data from user metadata
  user_full_name := COALESCE((NEW.raw_user_meta_data->>'full_name')::text, '');
  user_phone := COALESCE((NEW.raw_user_meta_data->>'phone')::text, NULL);
  user_email := COALESCE(NEW.email, '');

  -- Create profile in profiles table
  INSERT INTO public.profiles (id, role, full_name, email, phone)
  VALUES (
    NEW.id,
    'client', -- Default role for new users
    user_full_name,
    user_email,
    user_phone
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

-- 3. Trigger that executes the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Helper function to check if user is admin
-- (used in other RLS policies)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Ensure clients table has the necessary columns
ALTER TABLE public.clients 
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS app_role text DEFAULT 'Viewer';

-- Documentation comments
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates profile and client when a new user is created in auth';
COMMENT ON FUNCTION public.is_admin() IS 'Checks if the current user is admin';
COMMENT ON TABLE public.profiles IS 'User profiles table, linked to auth.users';

