# Utility Scripts

## Create Account

Script to create a new user account in the system.

### Usage

```bash
npm run create-account
```

The script will prompt for:
- **Email**: Your email address
- **Password**: Password for the account
- **Full name**: Your full name
- **Phone** (optional): Phone number
- **Role**: `admin` or `client` (default: `admin`)

### What the script does:

1. Creates a user in Supabase Auth
2. Creates a profile in the `profiles` table
3. Creates a record in the `clients` table (if needed)

### Note

If you already have environment variables configured in the `.env` file, the script will use them automatically. Otherwise, it will use the default project credentials.

