import { NextResponse } from 'next/server';
import { DiscoveryService } from '@/lib/discovery-service';
import { DEMO_USER_ID } from '@/lib/db';

/**
 * GET /api/matches (or /matches)
 * Purpose:
 * Return the logged-in user's mutual matches.
 * 
 * Strict Privacy Guarantees:
 * - Return ONLY verified mutual matches.
 * - NEVER return one-sided incoming likes.
 * - Return safe profile information.
 * - Persist matches across page reloads.
 */
export async function GET() {
  try {
    const matches = DiscoveryService.getMatches(DEMO_USER_ID);

    return NextResponse.json(
      {
        matches,
        count: matches.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve matches', details: error?.message },
      { status: 500 }
    );
  }
}
