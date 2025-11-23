// app/api/verify/route.ts
import { NextResponse } from 'next/server';
import {AllIds, DefaultConfigStore, SelfBackendVerifier} from '@selfxyz/core';

// Ensure this route runs on the Node.js runtime (not edge) because it uses a Node package
export const runtime = 'nodejs';

// Initialize Self backend verifier once (reuse between requests)
// Environment variables expected:
// - SELF_SCOPE_SEED: your backend scope seed (server-side secret)
// - SELF_ENDPOINT (optional): Self API endpoint (fallback to NEXT_PUBLIC_ZK_ENDPOINT or staging)
const endpoint = `${process.env.NEXT_PUBLIC_ZK_ENDPOINT}/api/verify/`;
const selfBackendVerifier = new (SelfBackendVerifier)(
  process.env.NEXT_PUBLIC_SELF_SCOPE_SEED || "None", endpoint,
  false,
  // The following parameters mirror the reference example. If your project defines
  // AllIds and DefaultConfigStore, you can replace the placeholders below with real imports.
  // Passing undefined for them will use library defaults.
    AllIds,
    new DefaultConfigStore({ // config store (see separate docs)
        minimumAge: 18,
    }),
  'hex'
);

export async function POST(request: Request) {
    console.log('Received request to /api/verify');
  try {

    const clone = request.clone();
    const textBody = await clone.text();
    console.log('Raw request body (/api/verify):', textBody);

    const body = await request.json();
    const { attestationId, proof, publicSignals, userContextData } = body || {};

    if (!proof || !publicSignals || !attestationId || !userContextData) {
        console.error('Missing required parameters in request body');
      return NextResponse.json(
        {
          status: 'error',
          result: false,
          reason: 'Proof, publicSignals, attestationId and userContextData are required',
        },
        { status: 200 }
      );
    }
    console.log('Received request to /api/verify:', {attestationId, proof, publicSignals, userContextData});

    const result = await (selfBackendVerifier).verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    console.log('Self backend verification result:', {result});

    const { isValid, isMinimumAgeValid } = result?.isValidDetails || {};

    if (!isValid || isMinimumAgeValid === false) {
      let reason = 'Verification failed';
      if (isMinimumAgeValid === false) reason = 'Minimum age verification failed';
      return NextResponse.json(
        {
          status: 'error',
          result: false,
          reason,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: 'success',
        result: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'error',
        result: false,
        reason,
      },
      { status: 200 }
    );
  }
}
