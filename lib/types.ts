export interface User {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string;
  interests: string[];
  createdAt: string;
}

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  location: string;
  interests: string[];
  createdAt: string;
}

export type SwipeAction = 'LIKE' | 'PASS';

export interface Swipe {
  id: string;
  userId: string;
  targetId: string;
  action: SwipeAction;
  createdAt: string;
}

export interface Match {
  id: string;
  userId: string;
  targetId: string;
  createdAt: string;
  profile?: Profile;
}

export interface SwipeRequest {
  profileId: string;
  action: SwipeAction;
}

export interface SwipeResponse {
  success: boolean;
  matched: boolean;
  match?: {
    id: string;
    profile: {
      id: string;
      name: string;
      age: number;
      photo: string;
      bio?: string;
      location?: string;
      interests?: string[];
    };
  };
}

export interface FeedResponse {
  profiles: Profile[];
  count: number;
}

export interface MatchesResponse {
  matches: {
    id: string;
    matchedAt: string;
    profile: Profile;
  }[];
  count: number;
}
