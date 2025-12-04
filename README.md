# **zkREX** - Privacy-Preserving Compliance for RWA Tokens

zkREX is a zero-knowledge compliance gateway for private tokenized assets.
It combines Self Protocol for zkKYC, Oasis Sapphire for confidential token execution, vLayer for additional zero-knowledge data proofs, and Privy for seamless wallet onboarding.

The result:
A secure, compliant, and privacy-preserving environment for trading RWA-style tokens, without exposing personal data or on-chain balances.

## **What We Built**

zkREX enables users to prove regulatory compliance privately and then interact with a confidential RWA token on Oasis.

## Zero-Knowledge KYC with Self Protocol

Users generate zk proofs for:

* Age ≥ 18
* Not on OFAC / not sanctioned
* Country is in the allowed list

Self’s onchain SDK verifies these proofs without revealing identity, passport details, or personal information.

## Private Transactions with Oasis Sapphire

T-Rex Token (our demo asset) is deployed on Oasis Sapphire, giving:

* Private balances
* Private transfer amounts
* Confidential smart contract execution
* No observable token movements on public state

This is ideal for private RWAs, security tokens, and sensitive financial flows.

## Additional Data via vLayer (Optional)

Users may enhance their compliance by providing:

* Proof of funds
* Proof of address

All verified using zkTLS and compressed via vLayer’s Prover Server into zero-knowledge proofs consumed by our smart contracts.

## Privy Wallet Integration

Users onboard instantly using:

* Email
* Social login
* Passkeys
* Embedded smart wallet

Privy ensures a smooth UX for RWA users who may not be crypto-native.

# Running the app locally

This repository contains a [Next.js 16](https://nextjs.org) application using React 19 and Tailwind CSS v4.

## Prerequisites

- Node.js 18.18+ (recommended 20+)
- pnpm, npm, or yarn package manager

## Environment variables

Create a `.env` file in the project root with the following variables:

```
# Auth (Privy)
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret

# ZK endpoint / contract address or API base used by the app
NEXT_PUBLIC_ZK_ENDPOINT=your_zk_endpoint_or_address
```

Notes:
- Values prefixed with `NEXT_PUBLIC_` are exposed to the browser. Do not put secrets in these.
- Never commit real secrets to version control. Use `.env.local` for local development when possible.

## Install dependencies

From the project root:

```bash
# with pnpm (recommended)
pnpm install

# or with npm	npm install

# or with yarn	yarn install
```

## Run the app (development)

Start the local dev server with HMR:

```bash
pnpm dev
# or: npm run dev
# or: yarn dev
```

Then open http://localhost:3000 in your browser.

## Build and run (production)

```bash
# Build
pnpm build

# Start the production server (after build)
pnpm start
```

## Available scripts

```bash
pnpm dev     # start Next.js in development mode
pnpm build   # build the app for production
pnpm start   # start the production server
pnpm lint    # run ESLint
```

## App routes you can try locally

- / — landing/home
- /app — main app page
- /app/trade — trading page
- /app/verify — self-verification flow

Depending on feature flags and environment values, some pages may require a valid `NEXT_PUBLIC_PRIVY_APP_ID` to sign in.

## Troubleshooting

- Port already in use: change the port with `PORT=3001 pnpm dev`.
- Missing env vars: ensure `.env` is present and contains the keys listed above. Restart the dev server after changes.

## Deployment

This is a standard Next.js app and can be deployed to platforms like Vercel, Netlify, or a custom Node server.

For Vercel:
1. Push your repo to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel and set the environment variables shown above.
3. Deploy.
