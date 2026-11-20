import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { seedDatabase } from '../scripts/seed';
import { DiscoveryService } from '../lib/discovery-service';
import { DEMO_USER_ID, getDatabase } from '../lib/db';

describe('Discovery & Mutual Matching Logic', () => {
  before(() => {
    // Reset database fresh before tests
    seedDatabase({ reset: true });
  });

  beforeEach(() => {
    // Clear only user swipes & matches between tests to have clean slate
    DiscoveryService.resetUserData(DEMO_USER_ID);
  });

  test('At least 30 profiles are seeded', () => {
    const db = getDatabase();
    const count = db.prepare('SELECT COUNT(*) as c FROM profiles').get() as { c: number };
    assert.ok(count.c >= 30, `Expected at least 30 profiles, got ${count.c}`);
  });

  test('GET /feed returns unswiped profiles and NEVER reveals incoming likes', () => {
    const feed = DiscoveryService.getFeed(DEMO_USER_ID, 50);
    assert.ok(feed.length >= 30);

    for (const profile of feed) {
      assert.ok(profile.id, 'Profile has id');
      assert.ok(profile.name, 'Profile has name');
      assert.ok(profile.photo, 'Profile has photo');
      // STRICT PRIVACY CHECK
      assert.strictEqual((profile as any).hasIncomingLike, undefined, 'Privacy leak: hasIncomingLike present!');
      assert.strictEqual((profile as any).likedYou, undefined, 'Privacy leak: likedYou present!');
      assert.strictEqual((profile as any).likesMe, undefined, 'Privacy leak: likesMe present!');
      assert.strictEqual((profile as any).incomingLike, undefined, 'Privacy leak: incomingLike present!');
    }
  });

  test('LIKE is persisted and excludes profile from subsequent feed', () => {
    const feedBefore = DiscoveryService.getFeed(DEMO_USER_ID);
    const target = feedBefore[0];

    // Target prof-02 does NOT have an incoming like
    const res = DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-02', 'LIKE');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.matched, false);

    // Profile must be excluded from feed now
    const feedAfter = DiscoveryService.getFeed(DEMO_USER_ID);
    const found = feedAfter.some(p => p.id === 'prof-02');
    assert.strictEqual(found, false, 'prof-02 must not appear in feed after being liked');
  });

  test('PASS is persisted and excludes profile from subsequent feed without match', () => {
    // prof-01 has an incoming like! Passing them must NEVER match and NEVER leak
    const res = DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-01', 'PASS');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.matched, false);

    // Excluded from feed
    const feedAfter = DiscoveryService.getFeed(DEMO_USER_ID);
    const found = feedAfter.some(p => p.id === 'prof-01');
    assert.strictEqual(found, false, 'Passed profile must not appear in feed');

    // Matches must be empty
    const matches = DiscoveryService.getMatches(DEMO_USER_ID);
    assert.strictEqual(matches.length, 0);
  });

  test('A profile cannot be swiped twice (duplicate swipe prevention)', () => {
    DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-04', 'LIKE');

    assert.throws(
      () => {
        DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-04', 'LIKE');
      },
      /already swiped/,
      'Must reject duplicate swipe'
    );
  });

  test('One-sided LIKE never creates a match', () => {
    // prof-04 has no incoming like
    const res = DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-04', 'LIKE');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.matched, false);

    const matches = DiscoveryService.getMatches(DEMO_USER_ID);
    const hasMatch = matches.some(m => m.profile.id === 'prof-04');
    assert.strictEqual(hasMatch, false);
  });

  test('Mutual LIKE creates exactly one match', () => {
    // prof-03 has an incoming like towards demo user
    const res = DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-03', 'LIKE');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.matched, true);
    assert.ok(res.match);
    assert.strictEqual(res.match?.profile.id, 'prof-03');

    const matches = DiscoveryService.getMatches(DEMO_USER_ID);
    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0].profile.id, 'prof-03');
    assert.strictEqual(matches[0].profile.name, 'Zara Chen');
  });

  test('Matches view returns only verified mutual matches and persists across queries', () => {
    // Swipe like on prof-05 (has incoming like) -> MATCH
    DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-05', 'LIKE');
    // Swipe like on prof-06 (no incoming like) -> NO MATCH
    DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-06', 'LIKE');
    // Swipe pass on prof-07 (has incoming like) -> NO MATCH
    DiscoveryService.recordSwipe(DEMO_USER_ID, 'prof-07', 'PASS');

    const matches = DiscoveryService.getMatches(DEMO_USER_ID);
    assert.strictEqual(matches.length, 1);
    assert.strictEqual(matches[0].profile.id, 'prof-05');
  });
});
