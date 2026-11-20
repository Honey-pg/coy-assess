import { getDatabase, DEMO_USER_ID, DEMO_USER } from './db';
import { Profile, SwipeAction, SwipeResponse } from './types';

export class DiscoveryService {
  /**
   * Retrieves discoverable profiles for the current user.
   * STRICT PRIVACY GUARANTEE:
   * - Excludes any profile the user has already swiped on (LIKE or PASS).
   * - Never returns whether a profile has liked the logged-in user.
   * - No 'likedYou', 'incomingLike', or similar properties are ever returned.
   */
  static getFeed(userId: string = DEMO_USER_ID, limit: number = 20): Profile[] {
    const db = getDatabase();

    // Query profiles that this user has NOT swiped on yet
    // Exclude self user ID if present in profiles
    const stmt = db.prepare(`
      SELECT p.id, p.name, p.age, p.photo, p.bio, p.location, p.interests, p.created_at
      FROM profiles p
      WHERE p.id != ?
        AND p.id NOT IN (
          SELECT target_id
          FROM swipes
          WHERE user_id = ?
        )
      ORDER BY p.id ASC
      LIMIT ?
    `);

    const rows = stmt.all(userId, userId, limit) as any[];

    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      age: r.age,
      photo: r.photo,
      bio: r.bio,
      location: r.location,
      interests: JSON.parse(r.interests || '[]'),
      createdAt: r.created_at,
    }));
  }

  /**
   * Records a swipe action for the user on a target profile.
   * - Validates action ('LIKE' | 'PASS').
   * - Ensures idempotency & prevents duplicate swipes via DB unique constraint.
   * - If action is 'LIKE' and an incoming 'LIKE' from target to user already exists:
   *   -> creates mutual match transactionally
   *   -> returns matched = true with public profile details
   * - If action is 'PASS':
   *   -> records PASS, NEVER creates match, NEVER leaks incoming like.
   */
  static recordSwipe(
    userId: string = DEMO_USER_ID,
    profileId: string,
    action: SwipeAction
  ): SwipeResponse {
    const db = getDatabase();

    // Verify target profile exists
    const profileStmt = db.prepare(`SELECT * FROM profiles WHERE id = ?`);
    const profile = profileStmt.get(profileId) as any;
    if (!profile) {
      throw new Error('Profile not found');
    }

    // Check if user already swiped on this profile
    const existingSwipeStmt = db.prepare(`
      SELECT action FROM swipes WHERE user_id = ? AND target_id = ?
    `);
    const existingSwipe = existingSwipeStmt.get(userId, profileId) as any;
    if (existingSwipe) {
      throw new Error(`Profile already swiped with action: ${existingSwipe.action}`);
    }

    // Check incoming swipe from target to user
    const incomingSwipeStmt = db.prepare(`
      SELECT action FROM swipes WHERE user_id = ? AND target_id = ?
    `);
    const incomingSwipe = incomingSwipeStmt.get(profileId, userId) as any;
    const hasIncomingLike = incomingSwipe && incomingSwipe.action === 'LIKE';

    // Execute swipe recording and potential match in a transaction
    const swipeId = `swipe-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    let isMatched = false;
    let matchId = '';

    const executeSwipeTx = db.transaction(() => {
      // 1. Insert swipe
      const insertSwipe = db.prepare(`
        INSERT INTO swipes (id, user_id, target_id, action, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))
      `);
      insertSwipe.run(swipeId, userId, profileId, action);

      // 2. Mutual match condition: Both parties have swiped LIKE
      if (action === 'LIKE' && hasIncomingLike) {
        // Canonical ordering of user pair to guarantee unique matches
        const [userA, userB] = [userId, profileId].sort();
        matchId = `match-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

        const insertMatch = db.prepare(`
          INSERT OR IGNORE INTO matches (id, user_a_id, user_b_id, created_at)
          VALUES (?, ?, ?, datetime('now'))
        `);
        const result = insertMatch.run(matchId, userA, userB);
        if (result.changes > 0) {
          isMatched = true;
        }
      }
    });

    executeSwipeTx();

    if (isMatched) {
      return {
        success: true,
        matched: true,
        match: {
          id: matchId,
          profile: {
            id: profile.id,
            name: profile.name,
            age: profile.age,
            photo: profile.photo,
            bio: profile.bio,
            location: profile.location,
            interests: JSON.parse(profile.interests || '[]'),
          },
        },
      };
    }

    return {
      success: true,
      matched: false,
    };
  }

  /**
   * Retrieves mutual matches for the user.
   * PRIVACY GUARANTEE: Only returns pairs where a verified mutual match exists.
   * Incoming unrequited likes are strictly excluded.
   */
  static getMatches(userId: string = DEMO_USER_ID) {
    const db = getDatabase();

    const stmt = db.prepare(`
      SELECT 
        m.id as match_id,
        m.created_at as matched_at,
        p.id, p.name, p.age, p.photo, p.bio, p.location, p.interests
      FROM matches m
      JOIN profiles p ON (
        (m.user_a_id = ? AND p.id = m.user_b_id) OR
        (m.user_b_id = ? AND p.id = m.user_a_id)
      )
      ORDER BY m.created_at DESC
    `);

    const rows = stmt.all(userId, userId) as any[];

    return rows.map((r) => ({
      id: r.match_id,
      matchedAt: r.matched_at,
      profile: {
        id: r.id,
        name: r.name,
        age: r.age,
        photo: r.photo,
        bio: r.bio,
        location: r.location,
        interests: JSON.parse(r.interests || '[]'),
        createdAt: r.matched_at,
      },
    }));
  }

  /**
   * Resets all user swipes and matches (used only for development/testing).
   */
  static resetUserData(userId: string = DEMO_USER_ID) {
    const db = getDatabase();
    const tx = db.transaction(() => {
      db.prepare(`DELETE FROM swipes WHERE user_id = ?`).run(userId);
      db.prepare(`DELETE FROM matches WHERE user_a_id = ? OR user_b_id = ?`).run(userId, userId);
    });
    tx();
  }
}
