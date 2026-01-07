# Quick Start Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your email credentials:

```
ZOHO_ACCOUNT_EMAIL=your-email@zoho.com
ZOHO_ACCOUNT_PASSWORD=your-app-password
```

**Note:** For Zoho, you may need to generate an app-specific password from your Zoho account settings if you have 2FA enabled.

## 3. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 4. Build for Production

```bash
npm run build
npm start
```

## What's Included

- **Multi-step offer creation form** - 7 steps to guide users through creating a real estate offer
- **MLS property lookup** - Fetches property details from MLS database
- **PDF generation** - Creates professional offer documents
- **Email notifications** - Sends offers to both buyer and your team
- **Auto-save** - Saves progress locally so users don't lose their work

## File Structure Overview

```
offer-site/
├── app/
│   ├── api/
│   │   ├── address-mlsid/      # Property lookup API
│   │   └── create-offer/       # Offer submission API
│   ├── css/                    # Tailwind CSS styles
│   ├── layout.tsx              # Root layout with fonts
│   └── page.tsx                # Main offer form page
├── components/
│   ├── onboarding/
│   │   ├── steps/              # 7 form steps
│   │   ├── OnboardingLayout.tsx
│   │   └── LoadingPopup.tsx
│   └── AIHelpBot.tsx           # AI assistance component
├── lib/
│   ├── offerApi.ts             # API client functions
│   └── offerStorage.ts         # LocalStorage helpers
└── types/
    └── offer.ts                # TypeScript definitions
```

## Customization

### Change Email Recipient

Edit `app/api/create-offer/route.js` and update line 222:

```javascript
to: 'your-email@example.com', // Change this
```

### Update API Endpoint

If your offer processing API is different, edit `app/api/create-offer/route.js` lines 78-79:

```javascript
const apiUrl = 'https://your-api.com/offer/';
const apiUrl_1 = 'https://your-api.com/';
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
npm run dev -- -p 3001
```

### Email Not Sending

1. Verify your `.env.local` credentials are correct
2. Check if Zoho requires an app-specific password
3. Make sure you're not hitting rate limits

### Property Lookup Failing

The address lookup uses an external API. If it's not working:
- Check the API endpoint is accessible
- Verify the API is returning the expected format
- Check `app/api/address-mlsid/route.ts` for error messages

## Support

For issues or questions, contact the development team or create an issue in your repository.
