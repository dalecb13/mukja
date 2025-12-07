# Captcha Configuration

## Overview

The waitlist form supports conditional captcha verification based on environment variables. This allows you to disable captcha in development environments for easier testing.

## Environment Variable

### `NEXT_PUBLIC_ENABLE_CAPTCHA`

Controls whether hCaptcha is enabled or disabled.

- **Default**: `true` (enabled) - if not set, captcha is enabled
- **Values**:
  - `"false"` - Disables captcha (for development)
  - Any other value or unset - Enables captcha (for production)

## Configuration

### Development (Disable Captcha)

Add to `apps/web/.env.local`:

```env
NEXT_PUBLIC_ENABLE_CAPTCHA=false
```

When disabled:
- Captcha component is not rendered
- Captcha validation is skipped
- "Join Waitlist" button is enabled immediately
- API route skips captcha verification

### Production (Enable Captcha)

In production (Vercel, etc.), either:
1. Don't set the variable (defaults to enabled)
2. Explicitly set it:

```env
NEXT_PUBLIC_ENABLE_CAPTCHA=true
```

When enabled:
- Captcha component is rendered
- Captcha token is required before submission
- API route verifies captcha with hCaptcha API

## Required Environment Variables (When Enabled)

When `NEXT_PUBLIC_ENABLE_CAPTCHA` is not `"false"`, you also need:

- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` - Public site key (client-side)
- `HCAPTCHA_SECRET_KEY` - Secret key (server-side only)

See `HCAPTCHA_SETUP.md` for details on obtaining these keys.

## Notes

- The variable name uses `NEXT_PUBLIC_` prefix so it's available in client-side code
- In development mode, the API route logs when captcha is skipped
- The button state automatically adjusts based on captcha enablement

