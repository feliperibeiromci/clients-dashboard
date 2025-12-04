# Supabase Database Functions Documentation

This directory contains SQL functions and triggers for automatic profile creation in the authentication system.

## Files

- `functions.sql` - SQL functions and triggers documentation (already applied to database)
- `migrations/` - Database migration files for version control
- `schema.sql` - Initial database schema

## Database Functions

### `handle_new_user()`

**Type**: Trigger Function  
**Trigger**: `on_auth_user_created` on `auth.users`  
**When**: Executes automatically after a new user is inserted into `auth.users`

**Purpose**: Automatically creates user profile and client record when a new user signs up.

**Actions**:
1. Extracts user data from `raw_user_meta_data`:
   - `full_name`
   - `phone`
   - `email`
2. Creates a record in `public.profiles` table:
   - `id`: User UUID from auth
   - `role`: Default `'client'`
   - `full_name`, `email`, `phone`: From user metadata
3. Creates a record in `public.clients` table:
   - `id`: User UUID from auth
   - `name`: User's full name
   - `email`, `phone`: From user metadata
   - `app_role`: Default `'Viewer'`

**Security**: Uses `SECURITY DEFINER` to execute with elevated privileges.

**Error Handling**: Uses `ON CONFLICT DO NOTHING` to prevent errors if records already exist.

---

### `is_admin()`

**Type**: Helper Function  
**Returns**: `boolean`

**Purpose**: Checks if the current authenticated user has admin role.

**Usage**: Used in Row Level Security (RLS) policies to control access.

**Example**:
```sql
SELECT public.is_admin(); -- Returns true if current user is admin
```

**Security**: Uses `SECURITY DEFINER` to execute with elevated privileges.

---

## Database Schema

### Table: `profiles`

Stores user profile information linked to Supabase Auth users.

**Columns**:
- `id` (uuid, PK, FK → `auth.users.id`) - User ID from auth
- `client_id` (uuid, FK → `clients.id`, nullable) - Linked client record
- `role` (text) - User role: `'admin'` or `'client'` (default: `'client'`)
- `full_name` (text, nullable) - User's full name
- `email` (text, nullable) - User's email
- `phone` (text, nullable) - User's phone number
- `created_at` (timestamp with time zone) - Record creation timestamp
- `updated_at` (timestamp with time zone) - Record last update timestamp

**Constraints**:
- `role` must be either `'admin'` or `'client'`
- `id` references `auth.users(id)` with CASCADE delete
- `client_id` references `clients(id)` with SET NULL on delete

---

## Row Level Security (RLS) Policies

### `profiles` Table Policies

1. **"Users can view own profile"**
   - Type: SELECT
   - Rule: Users can only view their own profile (`auth.uid() = id`)

2. **"Users can update own profile"**
   - Type: UPDATE
   - Rule: Users can only update their own profile (`auth.uid() = id`)

3. **"Admins can manage all profiles"**
   - Type: ALL (SELECT, INSERT, UPDATE, DELETE)
   - Rule: Users with `role = 'admin'` can manage all profiles

---

## How It Works

### Signup Flow

1. User signs up via `supabase.auth.signUp()` with metadata:
   ```typescript
   {
     email: 'user@example.com',
     password: 'password',
     options: {
       data: {
         full_name: 'John Doe',
         phone: '+1234567890'
       }
     }
   }
   ```

2. Supabase creates user in `auth.users` table

3. Trigger `on_auth_user_created` fires automatically

4. Function `handle_new_user()` executes:
   - Extracts metadata from `raw_user_meta_data`
   - Creates profile in `public.profiles`
   - Creates client in `public.clients`

5. User can now access their profile via `AuthContext`

---

## Important Notes

1. **Default Role**: New users receive `'client'` role by default. Admins must be promoted manually in the database.

2. **Idempotency**: Functions use `ON CONFLICT DO NOTHING` to prevent errors if records already exist (useful for retries).

3. **Security**: Functions use `SECURITY DEFINER` to execute with database owner privileges, necessary to create records on behalf of new users.

4. **Compatibility**: The `profiles` table structure is compatible with `AuthContext` which expects: `id`, `client_id`, `role`, `created_at`.

5. **Metadata Extraction**: User metadata (`full_name`, `phone`) must be passed during signup in `options.data` for the trigger to extract them correctly.

---

## Maintenance

### Promoting User to Admin

To promote a user to admin role:

```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'user-uuid-here';
```

### Viewing Trigger Status

```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

### Viewing Function Definitions

```sql
SELECT pg_get_functiondef('public.handle_new_user()'::regprocedure);
SELECT pg_get_functiondef('public.is_admin()'::regprocedure);
```
