# Authority Signup Documentation

## Overview
The Authority Signup flow is strictly controlled to ensure only authorized emergency response personnel and government officials can create accounts on the platform. This is managed via an official invite code.

## Environment Variable
**Name:** `NEXT_PUBLIC_AUTHORITY_INVITE_CODE`
**Purpose:** Sets the official invite code required to successfully register an Authority account.

## How Validation Works
When a user submits the Authority Signup form:
1. The API route (`src/app/api/auth/authority/signup/route.ts`) compares the provided `inviteCode` payload against the environment variable.
2. If `process.env.NEXT_PUBLIC_AUTHORITY_INVITE_CODE` is undefined in the environment, a development fallback of `"AEDFFD"` is used automatically.
3. If the provided code matches, the account is created.
4. If it does not match, a `403 Forbidden` response is returned with the message: *"Invalid invite code. Contact the system administrator or verify the code configured in .env.local."*

## How to Change the Invite Code
To update the code:
1. Open `.env.local` in the root directory.
2. Add or modify the value:
   ```env
   NEXT_PUBLIC_AUTHORITY_INVITE_CODE=YOUR_CUSTOM_CODE_HERE
   ```
3. Restart the development server (`npm run dev`) for the new environment variable to take effect.
