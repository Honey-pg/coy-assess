import { NextResponse } from 'next/server';
import { DiscoveryService } from '@/lib/discovery-service';
import { DEMO_USER_ID } from '@/lib/db';

/**
 * GET /api/feed (or /feed)
 * Purpose:
 * Return profiles that the logged-in user has NOT swiped on yet.
 * 
 * Strict Privacy Guarantees:
 * - Return profile details (id, name, age, photo, bio, location, interests).
 * - Exclude profiles already liked by the user.
 * - Exclude profiles already passed by the user.
 * - DO NOT expose incoming-like information (never include likedYou, likesMe, incomingLike, etc).
 * - Return an empty result when no profiles remain.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30', 10);

    const profiles = DiscoveryService.getFeed(DEMO_USER_ID, limit);

    return NextResponse.json(
      {
        profiles,
        count: profiles.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feed profiles', details: error?.message },
      { status: 500 }
    );
  }
}
