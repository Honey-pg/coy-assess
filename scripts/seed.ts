import { getDatabase, initSchema, DEMO_USER_ID, DEMO_USER } from '../lib/db';

export const MOCK_PROFILES = [
  {
    id: 'prof-01',
    name: 'Maya Lin',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
    bio: 'Architecture student at Berkeley. Addicted to matcha lattes, vintage film cameras, and brutalist design.',
    location: 'UC Berkeley',
    interests: ['Architecture', 'Film Photography', 'Matcha', 'Art Galleries', 'Vinyl'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-02',
    name: 'Julian Vance',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    bio: 'Bioinformatics researcher. Running my first half-marathon next month. Ask me about CRISPR or sourdough starters.',
    location: 'Stanford University',
    interests: ['Running', 'Science', 'Baking', 'Hiking', 'Podcasts'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-03',
    name: 'Zara Chen',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    bio: 'CS & Cognitive Science junior. Building silly web games and searching for the best rooftop sunset spots in SF.',
    location: 'San Francisco',
    interests: ['Coding', 'Board Games', 'Sunsets', 'Indie Rock', 'Boba'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-04',
    name: 'Liam Morales',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    bio: 'Acoustic guitar player, environmental policy enthusiast. If we match, tell me your favorite comfort movie.',
    location: 'Palo Alto',
    interests: ['Guitar', 'Sustainability', 'Cinema', 'Camping', 'Thrifting'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-05',
    name: 'Chloe Dupont',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    bio: 'Pastry chef in training. French expat living in SF. I test my new dessert recipes on friends.',
    location: 'Mission District, SF',
    interests: ['Baking', 'Foodie', 'Travel', 'French Cinema', 'Museums'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-06',
    name: 'Marcus Bell',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
    bio: 'Industrial designer. Minimalist, cyclist, and believer that good espresso solves 90% of life problems.',
    location: 'Oakland',
    interests: ['Cycling', 'Coffee', 'Design', 'Woodworking', 'Jazz'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-07',
    name: 'Elena Rostova',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    bio: 'Violinist & philosophy double major. Reading Dostoevsky in local parks on Sunday afternoons.',
    location: 'San Jose State',
    interests: ['Classical Music', 'Philosophy', 'Reading', 'Poetry', 'Tea'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-08',
    name: 'Aiden Patel',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    bio: 'Hardware engineer by day, amateur astrophotographer by night. Let us go stargazing outside the city lights.',
    location: 'Sunnyvale',
    interests: ['Astronomy', 'Robotics', 'Road Trips', 'Spicy Food', 'Sci-Fi'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-09',
    name: 'Sienna Brooks',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80',
    bio: 'Graphic novelist and ceramicist. My studio is messy, but my plants are thriving.',
    location: 'UC Santa Cruz',
    interests: ['Ceramics', 'Illustration', 'Plant Care', 'Vintage Fashion', 'Anime'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-10',
    name: 'Kai Takahashi',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
    bio: 'Surfer and oceanography student. Early mornings at Pacifica, evening tacos with friends.',
    location: 'Pacifica',
    interests: ['Surfing', 'Ocean Conservation', 'Tacos', 'Acoustic Jam', 'Dogs'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-11',
    name: 'Amara Okafor',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80',
    bio: 'Public health analyst. Big fan of Afrobeat, spicy jollof rice, and spontaneous weekend road trips.',
    location: 'San Francisco',
    interests: ['Afrobeats', 'Cooking', 'Volunteering', 'Fitness', 'Festivals'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-12',
    name: 'Noah Sterling',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&auto=format&fit=crop&q=80',
    bio: 'Documentary filmmaker. Currently editing a project on urban wildlife. I know all the best speakeasies.',
    location: 'San Francisco',
    interests: ['Documentaries', 'Mixology', 'Street Photography', 'Cinema', 'Live Music'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-13',
    name: 'Priya Sharma',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    bio: 'Economics major & debate captain at Stanford. Will respectfully debate you on whether pineapple belongs on pizza.',
    location: 'Stanford University',
    interests: ['Debate', 'Economics', 'Badminton', 'Stand-up Comedy', 'Podcasts'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-14',
    name: 'Lucas Silva',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=800&auto=format&fit=crop&q=80',
    bio: 'Bouldering gym setter & software engineer. Looking for a climbing partner and someone who loves dogs.',
    location: 'Berkeley',
    interests: ['Bouldering', 'Rock Climbing', 'Dogs', 'Tech', 'Craft Beer'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-15',
    name: 'Hanna Lindstrom',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1519742866993-66d3cfef4bbd?w=800&auto=format&fit=crop&q=80',
    bio: 'Swedish exchange student studying marine biology. Hygge enthusiast and lover of cold plunge mornings.',
    location: 'Monterey Bay',
    interests: ['Marine Life', 'Scuba Diving', 'Sauna', 'Nature Walks', 'Photography'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-16',
    name: 'Daniel Kim',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=800&auto=format&fit=crop&q=80',
    bio: 'Product designer obsessed with micro-interactions. Huge fan of specialty pour-overs and Japanese stationery.',
    location: 'Mountain View',
    interests: ['UI/UX', 'Stationery', 'Specialty Coffee', 'City Walks', 'Typography'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-17',
    name: 'Sofia Gomez',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=800&auto=format&fit=crop&q=80',
    bio: 'Journalist covering local arts and indie culture. Tell me the last song that gave you genuine chills.',
    location: 'Mission, SF',
    interests: ['Journalism', 'Concerts', 'Vinyl', 'Spanish Literature', 'Coffee'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-18',
    name: 'Ethan Wright',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80',
    bio: 'Pre-law student. Love playing tennis on Saturdays and thrift shopping for oversized vintage jackets.',
    location: 'Santa Clara University',
    interests: ['Tennis', 'Thrifting', 'Mock Trial', 'Sushi', 'Travel'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-19',
    name: 'Leila Farooq',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    bio: 'Data scientist who loves pottery and poetry. Looking for meaningful conversations over cardamom chai.',
    location: 'San Francisco',
    interests: ['Data Science', 'Chai', 'Pottery', 'Poetry', 'Museums'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-20',
    name: 'Oliver Thorne',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=800&auto=format&fit=crop&q=80',
    bio: 'Landscape architect. Obsessed with native California flora, backpacking Yosemite, and jazz records.',
    location: 'Mill Valley',
    interests: ['Backpacking', 'Botanicals', 'Jazz', 'Camping', 'National Parks'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-21',
    name: 'Mila Kovač',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
    bio: 'Contemporary dancer and choreographer. Catch me stretching anywhere or eating gelato at 11 PM.',
    location: 'San Francisco State',
    interests: ['Dance', 'Gelato', 'Theater', 'Yoga', 'Modern Art'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-22',
    name: 'Jordan Hayes',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&auto=format&fit=crop&q=80',
    bio: 'Sound engineer for local indie bands. Analog synthesizers and midnight diner breakfast enthusiast.',
    location: 'Oakland',
    interests: ['Audio Engineering', 'Live Music', 'Synths', 'Vinyl', 'Late Night Diners'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-23',
    name: 'Camila Reyes',
    age: 21,
    photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=80',
    bio: 'Urban planning undergrad. I will point out walkable neighborhood design everywhere we walk together.',
    location: 'UC Berkeley',
    interests: ['Urbanism', 'Biking', 'Farmers Markets', 'Street Food', 'Architecture'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-24',
    name: 'Tariq Mansour',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80',
    bio: 'Aerospace engineer working on satellite tech. Let us debate space exploration and interstellar travel.',
    location: 'San Jose',
    interests: ['Aerospace', 'Chess', 'Astronomy', 'Sci-Fi Books', 'Rock Climbing'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-25',
    name: 'Rowan Gallagher',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=80',
    bio: 'Botanist & wildlife photographer. I know bird calls and where to find wild orchids on the coast.',
    location: 'Marin County',
    interests: ['Wildlife', 'Photography', 'Botanicals', 'Trail Running', 'Birding'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-26',
    name: 'Zoe Nakamura',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop&q=80',
    bio: 'Fashion design student with an obsession with sustainable upcycling and Japanese streetwear.',
    location: 'San Francisco',
    interests: ['Fashion', 'Upcycling', 'Sewing', 'Flea Markets', 'Matcha'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-27',
    name: 'Benjamin Vance',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    bio: 'History master student. I can give you a personalized tour of secret historic monuments around the Bay.',
    location: 'Stanford University',
    interests: ['History', 'Museums', 'Bookstores', 'Coffee', 'Antiques'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-28',
    name: 'Ananya Deshmukh',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80',
    bio: 'Neuroscience researcher researching sleep cycles. Irony is I drink too much espresso.',
    location: 'UCSF Medical',
    interests: ['Neuroscience', 'Espresso', 'Pilates', 'Board Games', 'Cookbooks'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-29',
    name: 'Leo Castiglione',
    age: 25,
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&auto=format&fit=crop&q=80',
    bio: 'Sommelier in training & culinary enthusiast. I make homemade pasta from scratch on Friday nights.',
    location: 'North Beach, SF',
    interests: ['Wine Tasting', 'Pasta Making', 'Cooking', 'Italian Cinema', 'Travel'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-30',
    name: 'Chloe Zhang',
    age: 22,
    photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=80',
    bio: 'Game designer & 3D artist. Lover of cozy games, neon cityscapes, and mechanical keyboards.',
    location: 'San Jose State',
    interests: ['Game Design', '3D Art', 'Keyboards', 'Cozy Games', 'Synthwave'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
  {
    id: 'prof-31',
    name: 'Felix Montgomery',
    age: 24,
    photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=800&auto=format&fit=crop&q=80',
    bio: 'Woodworker and acoustic luthier. Building custom ukuleles and searching for the best fish tacos.',
    location: 'Santa Cruz',
    interests: ['Woodworking', 'Music', 'Surfing', 'Craftsmanship', 'Tacos'],
    hasIncomingLike: false,
  },
  {
    id: 'prof-32',
    name: 'Nadia Petrov',
    age: 23,
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80',
    bio: 'Astrophysics PhD student. Working with James Webb Telescope data. Let us contemplate the cosmos over tea.',
    location: 'Berkeley',
    interests: ['Astrophysics', 'Telescopes', 'Herbal Tea', 'Sci-Fi', 'Night Drives'],
    hasIncomingLike: true, // Will match immediately upon like!
  },
];

export function seedDatabase(options: { reset?: boolean } = {}) {
  const db = getDatabase();
  initSchema(db);

  if (options.reset) {
    console.log('Resetting all swipes, matches, and profiles...');
    db.exec(`
      DELETE FROM matches;
      DELETE FROM swipes;
      DELETE FROM profiles;
      DELETE FROM users;
    `);
  }

  // 1. Seed demo user idempotently
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, age, photo, bio, location, interests)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      age=excluded.age,
      photo=excluded.photo,
      bio=excluded.bio,
      location=excluded.location,
      interests=excluded.interests
  `);
  insertUser.run(
    DEMO_USER.id,
    DEMO_USER.name,
    DEMO_USER.age,
    DEMO_USER.photo,
    DEMO_USER.bio,
    DEMO_USER.location,
    JSON.stringify(DEMO_USER.interests)
  );

  // 2. Seed mock profiles idempotently
  const insertProfile = db.prepare(`
    INSERT INTO profiles (id, name, age, photo, bio, location, interests)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name=excluded.name,
      age=excluded.age,
      photo=excluded.photo,
      bio=excluded.bio,
      location=excluded.location,
      interests=excluded.interests
  `);

  // 3. Seed incoming likes (persisted as swipes from mock profiles -> demo user)
  // This satisfies:
  // - Real database persistence for incoming likes
  // - Never exposed to frontend (backend query excludes incoming metadata)
  // - Does NOT wipe or overwrite user swipes on restart
  const insertIncomingSwipe = db.prepare(`
    INSERT OR IGNORE INTO swipes (id, user_id, target_id, action, created_at)
    VALUES (?, ?, ?, 'LIKE', datetime('now', '-1 day'))
  `);

  const tx = db.transaction(() => {
    let seededProfilesCount = 0;
    let seededLikesCount = 0;

    for (const p of MOCK_PROFILES) {
      insertProfile.run(
        p.id,
        p.name,
        p.age,
        p.photo,
        p.bio,
        p.location,
        JSON.stringify(p.interests)
      );
      seededProfilesCount++;

      if (p.hasIncomingLike) {
        const swipeId = `seed-like-${p.id}->${DEMO_USER_ID}`;
        const res = insertIncomingSwipe.run(swipeId, p.id, DEMO_USER_ID);
        if (res.changes > 0) seededLikesCount++;
      }
    }

    return { seededProfilesCount, seededLikesCount };
  });

  const stats = tx();
  console.log(`Database seeded successfully!`);
  console.log(`- Profiles processed: ${stats.seededProfilesCount}`);
  console.log(`- Incoming seeded likes: ${stats.seededLikesCount} (persisted in DB for mutual match testing)`);
  return stats;
}

// Allow direct execution
if (require.main === module || process.argv[1]?.endsWith('seed.ts')) {
  const isReset = process.argv.includes('--reset');
  seedDatabase({ reset: isReset });
}
