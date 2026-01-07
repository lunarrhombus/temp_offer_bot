# Wayber Offer Generator - Standalone Site

This is a standalone version of the Wayber offer generation tool. It allows users to create real estate purchase offers through a step-by-step form process.

## Features

- 7-step guided offer creation process
- MLS property lookup
- Buyer information collection
- Financing details (Form 22A)
- Inspection addendum (Form 35)
- PDF generation of completed offers
- Email notifications to both buyer and team

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

3. Configure your environment variables:
   - `ZOHO_ACCOUNT_EMAIL`: Your Zoho email account
   - `ZOHO_ACCOUNT_PASSWORD`: Your Zoho email password

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

Build the application for production:

```bash
npm run build
npm start
```

## Project Structure

```
offer-site/
├── app/
│   ├── api/
│   │   └── create-offer/      # API endpoint for offer submission
│   ├── css/                    # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page (offer form)
├── components/
│   ├── onboarding/             # Multi-step form components
│   └── AIHelpBot.tsx           # AI assistance component
├── lib/
│   ├── offerApi.ts             # API utilities
│   └── offerStorage.ts         # LocalStorage utilities
└── types/
    └── offer.ts                # TypeScript type definitions
```

## API Integration

The application integrates with an external offer processing API. Make sure the API endpoint configured in `app/api/create-offer/route.js` is accessible:

- Primary endpoint: `https://offerbot.ngrok.app/offer/`
- Base URL: `https://offerbot.ngrok.app/`

## Environment Variables

Required environment variables:

- `ZOHO_ACCOUNT_EMAIL`: Email address for sending notifications
- `ZOHO_ACCOUNT_PASSWORD`: Password for the email account

## Deployment

This Next.js application can be deployed to:

- Vercel (recommended)
- Netlify
- Any Node.js hosting platform

Make sure to configure your environment variables in your deployment platform.

## License

Proprietary - Wayber
