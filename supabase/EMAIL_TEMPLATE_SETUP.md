# Supabase Email Template OTP Configuration

## Step by Step

### 1. Access Email Templates

1. Access the **Supabase Dashboard**
2. Go to **Authentication** → **Email Templates**
3. Click on **"Confirm sign up"** or create a new template

### 2. Configure the Template

In the "Confirm sign up" template, use the following content:

**Subject:**
```
Confirm Your Signup - Verification Code
```

**Body (Source):**
```html
<h2>Confirm your signup</h2>
<p>Hello!</p>
<p>Your verification code is:</p>
<h1 style="font-size: 32px; letter-spacing: 8px; color: #ff3856; text-align: center; margin: 20px 0;">{{ .Token }}</h1>
<p>Enter this 8-digit code to complete your registration.</p>
<p style="color: #747980; font-size: 14px;">This code will expire in 1 hour.</p>
<p>If you didn't request this code, please ignore this email.</p>
```

**Available Variables:**
- `{{ .Token }}` - The 8-digit OTP code
- `{{ .Email }}` - User's email
- `{{ .SiteURL }}` - Site URL
- `{{ .ConfirmationURL }}` - Confirmation URL (not used with OTP)
- `{{ .RedirectTo }}` - Redirect URL

### 3. Enable OTP in Supabase

1. Go to **Authentication** → **Settings**
2. Under **"Confirm sign up"**, make sure it is **enabled**
3. This ensures Supabase sends the OTP code instead of a link

### 4. Configure SMTP (Optional, but Recommended)

For production, configure custom SMTP:

1. Go to **Authentication** → **SMTP Settings**
2. Click **"Set up SMTP"**
3. Configure with your email provider (Gmail, SendGrid, Resend, etc.)

**Note:** Supabase's built-in email service has rate limits and is not recommended for production.

### 5. Test the Flow

1. Create an invite at `/settings`
2. Access the signup link
3. Fill out the form
4. Check your email - you should receive an 8-digit code
5. Enter the code on the verification screen

### Troubleshooting

**Problem: Email is not being sent**
- Check logs in **Logs** → **Auth Logs**
- Verify that "Confirm sign up" is enabled
- Verify that the template is saved correctly

**Problem: Code doesn't work**
- Verify you're using `type: 'signup'` in `verifyOtp`
- Verify the code hasn't expired (1 hour by default)
- Try resending the code using the "Resend code" button

**Problem: Email already exists**
- Delete the user in **Authentication** → **Users** for testing
- Or use a different email for testing

## How OTP Works

1. User signs up → Supabase creates unconfirmed account
2. Supabase sends email with OTP code (using the template)
3. User enters code → `verifyOtp()` validates the code
4. Supabase confirms the account → Trigger `handle_new_user` creates profile/client
5. User is redirected to `/welcome`

## Template Variables

- `{{ .Token }}` - **IMPORTANT**: This variable contains the 8-digit OTP code
- `{{ .Email }}` - User's email
- `{{ .SiteURL }}` - Base URL of your site
- `{{ .Data }}` - Custom data passed during signup
