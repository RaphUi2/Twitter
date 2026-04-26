import { useState, useEffect } from 'react';
import { AppState, User, Tweet, Notification, Message, List } from './types';
import { INITIAL_USERS, INITIAL_TWEETS } from './constants';

const STORAGE_KEY = 'twitter_clone_state';

const getInitialState = (): AppState => {
  const defaultState: AppState = {
    currentUser: null,
    users: INITIAL_USERS,
    tweets: INITIAL_TWEETS,
    notifications: [],
    messages: [],
    lists: [
      { id: 'list-1', name: 'Tech News', description: 'Les dernières nouvelles tech', userIds: ['user-1', 'user-2'], ownerId: 'current-user' },
      { id: 'list-2', name: 'Design Inspiration', description: 'Inspiration design quotidienne', userIds: ['user-1'], ownerId: 'current-user' }
    ],
    communities: [
      { id: 'comm-1', name: 'Développeurs React', description: 'Une communauté pour les passionnés de React', memberCount: 1250, icon: '⚛️' },
      { id: 'comm-2', name: 'Amateurs de Café', description: 'Partagez vos meilleurs grains', memberCount: 850, icon: '☕' }
    ],
    following: ['user-1', 'user-2'],
    bookmarks: [],
    theme: 'dark',
    aiPersonality: 'helpful',
    grokMessages: []
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        ...defaultState,
        ...parsed,
        // Ensure bookmarks exists even if parsed doesn't have it
        bookmarks: parsed.bookmarks || [],
        following: parsed.following || defaultState.following,
      };
    } catch (e) {
      console.error('Failed to parse saved state', e);
    }
  }
  return defaultState;
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(getInitialState());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tweetsRes, usersRes] = await Promise.all([
          fetch('/api/tweets'),
          fetch('/api/users')
        ]);
        const tweets = await tweetsRes.json();
        const users = await usersRes.json();
        setState(prev => ({ ...prev, tweets, users }));
      } catch (e) {
        console.error('Failed to fetch data', e);
      }
    };
    fetchData();
  }, []);

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const loggedInUser = await res.json();
        setState(prev => ({ ...prev, currentUser: loggedInUser }));
        return null;
      } else {
        const data = await res.json();
        return data.error || 'Identifiants incorrects';
      }
    } catch (e) {
      console.error('Login failed', e);
      return 'Erreur de connexion au serveur';
    }
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const signup = async (user: User) => {
    try {
      const res = await fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        const newUser = await res.json();
        // Clear local state specific to previous session when signing up
        setState(prev => ({
          ...prev,
          users: [...prev.users, newUser],
          currentUser: newUser,
          notifications: [],
          bookmarks: [],
          grokMessages: []
        }));

        // Simulate a welcome notification from a "real" person
        setTimeout(() => {
          addNotification(newUser.id, 'user-1', 'follow');
        }, 3000);

        return null;
      } else {
        const data = await res.json();
        return data.error || 'Erreur lors de l\'inscription';
      }
    } catch (e) {
      console.error('Signup failed', e);
      return 'Erreur de connexion au serveur';
    }
  };

  const guestLogin = () => {
    const guestUser: User = {
      id: 'guest-' + Date.now(),
      username: 'invite',
      displayName: 'Invité',
      email: 'guest@example.com',
      bio: 'Utilisateur invité',
      location: '',
      joinDate: new Date().toISOString(),
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=guest',
      coverImage: 'https://picsum.photos/seed/guest/1500/500',
      followersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      isVerified: false
    };
    setState(prev => ({
      ...prev,
      currentUser: guestUser,
      notifications: [],
      bookmarks: [],
      grokMessages: []
    }));
  };

  const addTweet = async (tweet: Tweet) => {
    try {
      const res = await fetch('/api/tweets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tweet)
      });
      if (res.ok) {
        const newTweet = await res.json();
        setState(prev => ({
          ...prev,
          tweets: [newTweet, ...prev.tweets]
        }));
      }
    } catch (e) {
      console.error('Add tweet failed', e);
    }
  };

  const deleteTweet = (tweetId: string) => {
    setState(prev => ({
      ...prev,
      tweets: prev.tweets.filter(t => t.id !== tweetId)
    }));
  };

  const toggleLike = async (tweetId: string, userId: string) => {
    try {
      const res = await fetch(`/api/tweets/${tweetId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const updatedTweet = await res.json();
        setState(prev => ({
          ...prev,
          tweets: prev.tweets.map(t => t.id === tweetId ? updatedTweet : t)
        }));

        // Generate notification if liked (not unliked)
        if (updatedTweet.likes.includes(userId)) {
          addNotification(updatedTweet.userId, userId, 'like', tweetId);
        }
      }
    } catch (e) {
      console.error('Toggle like failed', e);
    }
  };

  const toggleRetweet = async (tweetId: string, userId: string) => {
    try {
      const res = await fetch(`/api/tweets/${tweetId}/retweet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        const updatedTweet = await res.json();
        setState(prev => ({
          ...prev,
          tweets: prev.tweets.map(t => t.id === tweetId ? updatedTweet : t)
        }));

        // Generate notification if retweeted (not unretweeted)
        if (updatedTweet.retweets.includes(userId)) {
          addNotification(updatedTweet.userId, userId, 'retweet', tweetId);
        }
      }
    } catch (e) {
      console.error('Toggle retweet failed', e);
    }
  };

  const followUser = async (targetUserId: string) => {
    if (!state.currentUser) return;
    try {
      await fetch(`/api/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: state.currentUser.id })
      });
      
      setState(prev => ({
        ...prev,
        following: [...prev.following, targetUserId]
      }));
      addNotification(targetUserId, state.currentUser.id, 'follow');
    } catch (e) {
      console.error('Follow failed', e);
    }
  };

  const unfollowUser = (targetUserId: string) => {
    if (!state.currentUser) return;
    setState(prev => ({
      ...prev,
      following: prev.following.filter(id => id !== targetUserId)
    }));
  };

  const toggleBookmark = (tweetId: string) => {
    setState(prev => {
      const isBookmarked = prev.bookmarks.includes(tweetId);
      return {
        ...prev,
        bookmarks: isBookmarked 
          ? prev.bookmarks.filter(id => id !== tweetId)
          : [...prev.bookmarks, tweetId]
      };
    });
  };

  const togglePin = (tweetId: string) => {
    if (!state.currentUser) return;
    setState(prev => {
      const isPinned = prev.currentUser?.pinnedTweetId === tweetId;
      const updatedUser = {
        ...prev.currentUser!,
        pinnedTweetId: isPinned ? undefined : tweetId
      };
      return {
        ...prev,
        currentUser: updatedUser,
        users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
      };
    });
  };

  const toggleTheme = () => {
    setState(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
  };

  const addMessage = (msg: Message) => {
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, msg]
    }));
  };

  const markNotificationsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, isRead: true }))
    }));
  };

  const addNotification = (userId: string, fromUserId: string, type: 'like' | 'retweet' | 'reply' | 'follow' | 'mention', tweetId?: string) => {
    if (userId === fromUserId) return; // Don't notify self
    
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      fromUserId,
      type,
      tweetId,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications]
    }));
  };

  const resetData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(getInitialState());
  };

  const exportData = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'twitter_clone_data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const updateProfile = (updatedUser: User) => {
    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      users: prev.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  const setAiPersonality = (personality: 'helpful' | 'sarcastic' | 'visionary') => {
    setState(prev => ({ ...prev, aiPersonality: personality }));
  };

  const sendGrokMessage = async (content: string) => {
    const userMsg = { role: 'user' as const, content, timestamp: new Date().toISOString() };
    setState(prev => ({
      ...prev,
      grokMessages: [...prev.grokMessages, userMsg]
    }));

    // Simulate AI response
    setTimeout(() => {
      let response = "Je suis l'IA de Twitter. Comment puis-je vous aider ?";
      if (state.aiPersonality === 'sarcastic') {
        response = "Oh, encore une question passionnante... Je plaisante. Je suis là pour vous aider, je suppose.";
      } else if (state.aiPersonality === 'visionary') {
        response = "Je vois un futur où l'information circule librement et instantanément. Votre question s'inscrit dans cette vision.";
      }

      const aiMsg = { role: 'assistant' as const, content: response, timestamp: new Date().toISOString() };
      setState(prev => ({
        ...prev,
        grokMessages: [...prev.grokMessages, userMsg, aiMsg]
      }));
    }, 1000);
  };

  // Simulation of real-time activity removed for real backend
  
  return {
    state,
    login,
    logout,
    signup,
    guestLogin,
    addTweet,
    deleteTweet,
    toggleLike,
    toggleRetweet,
    followUser,
    unfollowUser,
    toggleBookmark,
    togglePin,
    toggleTheme,
    addMessage,
    addNotification,
    markNotificationsRead,
    resetData,
    exportData,
    updateProfile,
    setAiPersonality,
    sendGrokMessage
  };
};
