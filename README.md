# Coy Discover — Swipe & Match Feature (Part B)

A production-quality MVP of a swipe-based dating and discovery product inspired by Bumble and Tinder, built with a mobile-first, minimal, premium interface and zero-leak privacy guarantees.

---

## 🌟 Key Highlights & Architectural Decisions

1. **Strict Privacy Architecture (Zero-Leak)**:
   - Coy's fundamental product promise is that incoming interest is **never revealed** until mutual interest exists.
   - The backend query for `/feed` strictly omits any indication of incoming likes. Fields like `hasIncomingLike`, `likedYou`, or `incomingLike` do not exist in API responses or the frontend state.
   - Incoming likes are persisted in the database as actual `swipes` records (`target_id = demo_user, action = 'LIKE'`), allowing real database-driven mutual matching without leaking anything before the user swipes right.

2. **Genuine Mutual Matching & Consistency**:
   - Swiping **LIKE** on a profile that already liked the user immediately creates a mutual match via SQLite atomic transactions.
   - Swiping **PASS** on a profile that already liked the user records the pass, creates **NO** match, and **never** alerts the user of the missed like.
   - Swiping on someone who hasn't liked the user records the like without creating a match.

3. **Backend-Enforced Feed Exclusion & Duplicate Prevention**:
   - Swiped profiles (both liked and passed) are filtered out **at the database query layer**, not just hidden in CSS or state.
   - The `swipes` table enforces a `UNIQUE(user_id, target_id)` constraint, preventing duplicate swipes or replay attacks.

4. **Smooth Mobile & Desktop Interaction**:
   - Natural touch/pointer dragging with physical rotation and translation via Framer Motion.
   - Dynamic stamps (`LIKE` in green, `PASS` in rose) appear with proportional opacity as the card is dragged.
   - Dedicated action buttons for desktop users and accessibility.
   - Image fallback protection for unreliable network connections.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, Route Handlers, React 19, TypeScript)
- **Styling**: Tailwind CSS with custom Coy dark-mode palette (`coy-bg`, `coy-surface`, `coy-card`, `coy-border`, `brand-500`)
- **Gestures & Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: SQLite with `better-sqlite3` (WAL mode enabled, indexed foreign keys, transactional integrity)
- **Testing**: Node.js Native Test Runner (`node:test`, `node:assert/strict`) with `tsx`

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── feed/route.ts        # GET /api/feed (safe unswiped profiles)
│   │   ├── swipe/route.ts       # POST /api/swipe (records swipe & handles mutual matching)
│   │   ├── matches/route.ts     # GET /api/matches (returns mutual matches)
│   │   └── dev/reset/route.ts   # POST /api/dev/reset (deck reset helper for testing)
│   ├── feed/route.ts            # GET /feed alias
│   ├── swipe/route.ts           # POST /swipe alias
│   ├── matches/route.ts         # GET /matches alias
│   ├── globals.css              # Custom styling, dark mode scrollbars
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main Discover client page (tab switching, deck state)
├── components/
│   ├── BottomNavigation.tsx     # Home & Discover tabs + Matches shortcut
│   ├── ProfileCard.tsx          # Swipeable card with gestures, stamps & tags
│   ├── SwipeControls.tsx        # LIKE / PASS action buttons
│   ├── MatchModal.tsx           # "It's a Match!" celebration modal
│   ├── MatchesList.tsx          # Grid view of mutual matches with detail inspection
│   └── EmptyState.tsx           # "You've seen everyone" screen with deck reset
├── lib/
│   ├── constants.ts             # Demo user details & IDs
│   ├── db.ts                    # SQLite database connection & schema initialization
│   ├── discovery-service.ts     # Core business logic: feed, swipe, matches, privacy
│   ├── types.ts                 # Full TypeScript definitions
│   └── utils.ts                 # Classname utility helpers
├── scripts/
│   └── seed.ts                  # Idempotent database seeder (32 diverse profiles)
├── tests/
│   └── discovery.test.ts        # Automated unit & integration tests
├── data/
│   └── coy.db                   # SQLite database file (WAL mode)
└── package.json
```

---

## 🚀 Quick Setup & Run Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize and Seed the Database
Seeds 32 realistic profiles across universities (Stanford, UC Berkeley, etc.) with 16 seeded incoming likes:
```bash
npm run seed
```
To wipe and cleanly reseed:
```bash
npm run reset
```

### 3. Run Automated Tests
```bash
npm test
```
All 8 test suites pass, verifying feed exclusion, mutual matching, duplicate prevention, and strict privacy.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build & Start
```bash
npm run build
npm run start
```

---

## 📡 API Endpoints

### 1. `GET /feed` (or `GET /api/feed`)
Returns discoverable profiles that the logged-in user has **not** swiped on yet.
- **Privacy**: Does not include any incoming like indicators.
- **Query Params**: `?limit=30` (optional)
- **Response**:
```json
{
  "profiles": [
    {
      "id": "prof-01",
      "name": "Maya Lin",
      "age": 22,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture student at Berkeley...",
      "location": "UC Berkeley",
      "interests": ["Architecture", "Film Photography", "Matcha"],
      "createdAt": "2026-11-20 04:30:00"
    }
  ],
  "count": 1
}
```

### 2. `POST /swipe` (or `POST /api/swipe`)
Records a swipe action (`LIKE` or `PASS`) on a profile.
- **Request Body**:
```json
{
  "profileId": "prof-01",
  "action": "LIKE"
}
```
- **Response (No Match / One-sided Like or Pass)**:
```json
{
  "success": true,
  "matched": false
}
```
- **Response (Mutual Match)**:
```json
{
  "success": true,
  "matched": true,
  "match": {
    "id": "match-1795149905559-wpuzwk",
    "profile": {
      "id": "prof-01",
      "name": "Maya Lin",
      "age": 22,
      "photo": "https://images.unsplash.com/...",
      "bio": "Architecture student at Berkeley...",
      "location": "UC Berkeley",
      "interests": ["Architecture", "Film Photography", "Matcha"]
    }
  }
}
```
- **Error (Duplicate Swipe)**:
HTTP 409 Conflict: `{"error": "Profile already swiped with action: LIKE"}`

### 3. `GET /matches` (or `GET /api/matches`)
Returns all persisted mutual matches for the user.
- **Response**:
```json
{
  "matches": [
    {
      "id": "match-1795149905559-wpuzwk",
      "matchedAt": "2026-11-20 04:45:05",
      "profile": { ... }
    }
  ],
  "count": 1
}
```

---

## 🔒 Privacy & Edge Case Handling Summary

| Scenario | Behavior |
|---|---|
| User likes a profile that hasn't liked them | Records `LIKE`. `matched: false`. Profile excluded from future feed. |
| User passes a profile that has already liked them | Records `PASS`. `matched: false`. Incoming like is never revealed. |
| User likes a profile that has already liked them | Atomic transaction creates a match. `matched: true`. Displays "It's a Match!" modal. |
| User refreshes or restarts server | Swipes & matches are persisted in SQLite; already-swiped cards never return. |
| Duplicate swipe attempt | Database unique constraint rejects action with HTTP 409 error. |
| Deck exhausted | Clean empty state with "You've seen everyone for now" and a reset option. |
