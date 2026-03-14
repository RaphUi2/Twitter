import { User, Tweet, Notification, Message, Trend } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    username: 'tech_guru',
    displayName: 'Tech Guru',
    email: 'guru@tech.com',
    bio: 'Building the future of the web. 🚀 #React #Web3',
    location: 'San Francisco, CA',
    website: 'techguru.dev',
    joinDate: '2022-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech',
    coverImage: 'https://picsum.photos/seed/tech/1500/500',
    followersCount: 12500,
    followingCount: 450,
    tweetsCount: 1200,
    isVerified: true
  },
  {
    id: 'user-2',
    username: 'design_queen',
    displayName: 'Design Queen',
    email: 'queen@design.com',
    bio: 'Pixel perfect designs and aesthetic vibes. ✨',
    location: 'Paris, France',
    website: 'designqueen.studio',
    joinDate: '2021-05-20',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=design',
    coverImage: 'https://picsum.photos/seed/design/1500/500',
    followersCount: 8900,
    followingCount: 320,
    tweetsCount: 850,
    isVerified: true
  },
  {
    id: 'user-3',
    username: 'code_ninja',
    displayName: 'Code Ninja',
    email: 'ninja@code.com',
    bio: 'I speak in JavaScript and TypeScript. 💻',
    location: 'Tokyo, Japan',
    website: 'codeninja.io',
    joinDate: '2023-02-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ninja',
    coverImage: 'https://picsum.photos/seed/ninja/1500/500',
    followersCount: 5400,
    followingCount: 150,
    tweetsCount: 420,
    isVerified: false
  },
  {
    id: 'user-4',
    username: 'news_flash',
    displayName: 'News Flash',
    email: 'news@flash.com',
    bio: 'Breaking news from around the world. 🌍',
    location: 'New York, NY',
    website: 'newsflash.com',
    joinDate: '2020-11-05',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=news',
    coverImage: 'https://picsum.photos/seed/news/1500/500',
    followersCount: 45000,
    followingCount: 120,
    tweetsCount: 15000,
    isVerified: true
  },
  {
    id: 'user-5',
    username: 'travel_bug',
    displayName: 'Travel Bug',
    email: 'travel@bug.com',
    bio: 'Exploring the hidden gems of the planet. ✈️',
    location: 'Nomadic',
    website: 'travelbug.blog',
    joinDate: '2022-08-30',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=travel',
    coverImage: 'https://picsum.photos/seed/travel/1500/500',
    followersCount: 3200,
    followingCount: 800,
    tweetsCount: 210,
    isVerified: false
  }
];

export const INITIAL_TWEETS: Tweet[] = [
  {
    id: 'tweet-1',
    userId: 'user-1',
    content: 'React 19 is absolutely game-changing! The new hooks are so clean. #ReactJS #WebDev',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    likes: ['user-2', 'user-3'],
    retweets: ['user-4'],
    replies: [],
    media: ['https://picsum.photos/seed/react/800/450'],
    isPinned: true
  },
  {
    id: 'tweet-2',
    userId: 'user-4',
    content: 'BREAKING: New breakthrough in sustainable energy announced today. A huge step for humanity! 🌱',
    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    likes: ['user-1', 'user-5'],
    retweets: ['user-1', 'user-2', 'user-3'],
    replies: [],
  },
  {
    id: 'tweet-3',
    userId: 'user-2',
    content: 'Just finished a new UI kit for dark mode lovers. What do you think? 🖤',
    timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    likes: ['user-1', 'user-3', 'user-4', 'user-5'],
    retweets: [],
    replies: [],
    media: ['https://picsum.photos/seed/ui/800/450'],
  }
];

export const TRENDS: Trend[] = [
  { id: '1', name: '#ReactJS', tweetCount: '125K' },
  { id: '2', name: 'TypeScript', tweetCount: '85K' },
  { id: '3', name: '#WebDevelopment', tweetCount: '45K' },
  { id: '4', name: 'TailwindCSS', tweetCount: '32K' },
  { id: '5', name: 'OpenAI', tweetCount: '210K' },
];
