# MomBestie AI — Provider Portal

Dashboard for family-service providers (babysitters, postpartum support, meal prep, and similar categories) on **MomBestie AI**. React 19 + Vite + Tailwind CSS v4.

Covers bookings, availability, public profile, earnings & commission breakdown, messages, and verification status.

This is one repo in MomBestie's poly-repo platform — see [mombestie-docs](https://github.com/DaitchPro-MomBestie-AI/mombestie-docs) for the full system architecture.

## Verification is backend-controlled

Providers cannot self-mark their profile "Verified" — the badge only reflects real admin-approved state (see the Verification tab, and the corresponding approval queue in [mombestie-admin-portal](https://github.com/DaitchPro-MomBestie-AI/mombestie-admin-portal)).

## Status

Frontend prototype — mock bookings/earnings data, no live payouts. Login accepts any input (no real auth yet). See mombestie-docs for the multi-step onboarding flow (identity → category → docs → application fee → payout setup) this portal is designed toward.

## Development

```bash
npm install
npm run dev
```
