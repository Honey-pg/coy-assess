import { NextResponse } from 'next/server';
import { DiscoveryService } from '@/lib/discovery-service';
import { DEMO_USER_ID } from '@/lib/db';
import { SwipeAction } from '@/lib/types';

/**
 * POST /api/swipe (or /swipe)
 * Purpose:
 * Record the user's swipe action.
 * 
 * Request Body:
 * {
 *   "profileId": "prof-01",
 *   "action": "LIKE" | "PASS"
 * }
 * 
 * Strict Rules:
 * - Validate profile ID.
 * - Validate action.
 * - Persist the swipe in SQLite.
 * - Prevent duplicate swipes (rejects duplicate submissions).
 * - Check whether an incoming LIKE already exists.
 * - Create a mutual match only if user swiped LIKE and target swiped LIKE.
 * - Return matched = true with match object ONLY on mutual match.
 * - If action is PASS, NEVER match and NEVER leak incoming like status.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { profileId, action } = body as { profileId?: string; action?: string };

    if (!profileId || typeof profileId !== 'string') {
      return NextResponse.json(
        { error: 'profileId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!action || (action !== 'LIKE' && action !== 'PASS')) {
      return NextResponse.json(
        { error: "action must be either 'LIKE' or 'PASS'" },
        { status: 400 }
      );
    }

    const result = DiscoveryService.recordSwipe(
      DEMO_USER_ID,
      profileId,
      action as SwipeAction
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('Error recording swipe:', error);

    const errorMessage = error?.message || 'Failed to record swipe';

    if (errorMessage.includes('already swiped')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 409 } // Conflict
      );
    }

    if (errorMessage.includes('not found')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 404 } // Not found
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
