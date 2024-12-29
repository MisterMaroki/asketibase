# Asketi Project Handover

## Critical API Keys and Environment Variables

1. Resend setup with correct domain
2. Stripe setup with correct webhook listener and redirect urls
3. Google maps api key usage
4.

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

## Important Project Notes

### Authentication

- Anonymous authentication is enabled
- Row Level Security (RLS) policies are in place for data protection
- User sessions are managed via middleware

### Database

- Products are managed in Stripe and synced to Supabase via webhooks
- Database migrations are located in `supabase/migrations/`
- Generate types: `npm run generate-types`
- Run migrations: `npm run migration:up`

### Email Development

- Email templates are in `src/features/emails/`
- Development server: `npm run email:dev`
- Build emails: `npm run email:build`

### Stripe Integration

- Webhook listener: `npm run stripe:listen`
- Products and prices are managed in Stripe
- Sync happens automatically via webhooks

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

## Project Structure

- `/src/features/membership/` - Core membership functionality
- `/src/features/emails/` - Email templates and handlers
- `/src/libs/` - Service clients (Stripe, Supabase, Resend)
- `/src/components/` - Reusable UI components

## Important Constants

- Membership types and pricing in `src/constants/membership.ts`
- Supported countries and currencies in `src/constants/options.ts`

## License

MIT License - See LICENSE file for details
