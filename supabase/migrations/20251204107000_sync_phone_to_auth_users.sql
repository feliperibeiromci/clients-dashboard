-- ============================================
-- Sync phone from metadata to auth.users.phone
-- This ensures the phone number is saved in both metadata and the phone column
-- ============================================

-- Function to sync phone from metadata to auth.users.phone
CREATE OR REPLACE FUNCTION public.sync_phone_to_auth_users()
RETURNS trigger AS $$
BEGIN
  -- Update phone field in auth.users from metadata
  -- Only update if phone exists in metadata and is different from current value
  IF NEW.raw_user_meta_data->>'phone' IS NOT NULL 
     AND (NEW.phone IS NULL OR NEW.phone != (NEW.raw_user_meta_data->>'phone')::text) THEN
    NEW.phone := (NEW.raw_user_meta_data->>'phone')::text;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync phone after user creation
DROP TRIGGER IF EXISTS sync_phone_on_user_create ON auth.users;
CREATE TRIGGER sync_phone_on_user_create
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_phone_to_auth_users();

-- Create trigger to sync phone when metadata is updated
DROP TRIGGER IF EXISTS sync_phone_on_metadata_update ON auth.users;
CREATE TRIGGER sync_phone_on_metadata_update
  BEFORE UPDATE OF raw_user_meta_data ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data->>'phone' IS DISTINCT FROM OLD.raw_user_meta_data->>'phone')
  EXECUTE FUNCTION public.sync_phone_to_auth_users();

-- Also update existing users that have phone in metadata but not in phone column
UPDATE auth.users
SET phone = (raw_user_meta_data->>'phone')::text
WHERE raw_user_meta_data->>'phone' IS NOT NULL 
  AND (phone IS NULL OR phone != (raw_user_meta_data->>'phone')::text);

-- Documentation
COMMENT ON FUNCTION public.sync_phone_to_auth_users() IS 
  'Syncs phone number from user metadata to auth.users.phone column automatically';

