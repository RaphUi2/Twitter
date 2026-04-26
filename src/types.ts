export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  bio: string;
  location: string;
  website?: string;
  joinDate: string;
  avatar: string;
  coverImage: string;
  followersCount: number;
  followingCount: number;
  tweetsCount: number;
  isVerified: boolean;
  pinnedTweetId?: string;
  password?: string;
}

export interface Tweet {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: string[]; // Array of user IDs
  retweets: string[]; // Array of user IDs
  replies: Tweet[];
  media?: string[];
  isPinned?: boolean;
  isSponsored?: boolean;
}

export interface Notification {
  id: string;
  userId: string; // Recipient
  fromUserId: string;
  type: 'like' | 'retweet' | 'reply' | 'follow' | 'mention';
  tweetId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface Trend {
  id: string;
  name: string;
  tweetCount: string;
}

export interface List {
  id: string;
  name: string;
  description: string;
  userIds: string[];
  ownerId: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
}

export interface AppState {
  currentUser: User | null;
  users: User[];
  tweets: Tweet[];
  notifications: Notification[];
  messages: Message[];
  lists: List[];
  communities: Community[];
  following: string[]; // IDs of users the current user follows
  bookmarks: string[]; // IDs of bookmarked tweets
  theme: 'light' | 'dark';
  aiPersonality: 'helpful' | 'sarcastic' | 'visionary';
  grokMessages: { role: 'user' | 'assistant', content: string, timestamp: string }[];
}
