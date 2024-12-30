# Asketi Project Handover

## Critical API Keys and Environment Variables

1. Resend setup with correct domain
2. Stripe setup with correct webhook listener and redirect urls
3. Google maps api key usage
4. google console setup, oauth client, redirect url
5. ALL PRIVACTY AND TERMS LINKS
 

Make sure to set up the following environment variables in your `.env.local` file:

### Supabase Configuration

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (admin access)

### Payment Processing

- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- Note: Stripe webhooks are configured to forward to `/api/webhooks`

### Email Service

- `RESEND_API_KEY` - Resend.com API key for email notifications

### Maps Integration

- `MAPS_API_KEY` - Google Maps API key for address autocomplete

## TODO

- [google auth] https://supabase.com/docs/guides/auth/social-login/auth-google?queryGroups=environment&environment=client
- [supabase custom domains] https://supabase.com/docs/guides/platform/custom-domains
