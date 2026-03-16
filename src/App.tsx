import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { MobileHeader } from './components/MobileHeader';
import { RightPanel } from './components/RightPanel';
import { TweetCard } from './components/TweetCard';
import { TweetComposer } from './components/TweetComposer';
import { Auth } from './components/Auth';
import { EditProfileModal } from './components/EditProfileModal';
import { useAppState } from './useAppState';
import { Tweet, User } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Link as LinkIcon,
  Bell,
  Heart,
  Repeat2,
  UserPlus,
  MessageCircle,
  Search,
  Settings,
  LogOut,
  Moon,
  Sun,
  MoreHorizontal,
  Sparkles,
  Users,
  ListTodo,
  Plus,
  X
} from 'lucide-react';

export default function App() {
  const { 
    state, 
    login, 
    logout, 
    signup, 
    addTweet, 
    deleteTweet, 
    toggleLike, 
    toggleRetweet,
    followUser,
    unfollowUser,
    toggleTheme,
    exportData,
    resetData,
    updateProfile,
    markNotificationsRead,
    setAiPersonality,
    sendGrokMessage
  } = useAppState();

  const [activeTab, setActiveTab] = React.useState('home');
  const [feedType, setFeedType] = React.useState<'for-you' | 'following'>('for-you');
  const [viewingUserId, setViewingUserId] = React.useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [replyingTo, setReplyingTo] = React.useState<Tweet | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [grokInput, setGrokInput] = React.useState('');
  const [isMobileComposeOpen, setIsMobileComposeOpen] = React.useState(false);

  if (!state.currentUser) {
    return <Auth onLogin={login} onSignup={signup} users={state.users} />;
  }

  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

  const handlePostTweet = (content: string, media?: string[]) => {
    const newTweet: Tweet = {
      id: `tweet-${Date.now()}`,
      userId: state.currentUser!.id,
      content,
      timestamp: new Date().toISOString(),
      likes: [],
      retweets: [],
      replies: [],
      media
    };

    if (replyingTo) {
      addTweet(newTweet);
      setReplyingTo(null);
    } else {
      addTweet(newTweet);
    }
  };

  const handleProfileClick = (userId: string) => {
    setViewingUserId(userId);
    setActiveTab('profile');
    window.scrollTo(0, 0);
  };

  const filteredTweets = state.tweets.filter(tweet => {
    const matchesSearch = tweet.content.toLowerCase().includes(searchQuery.toLowerCase());
    if (feedType === 'following') {
      return (state.following.includes(tweet.userId) || tweet.userId === state.currentUser?.id) && matchesSearch;
    }
    return matchesSearch;
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 border-b border-gray-200 dark:border-gray-800">
              <div className="hidden sm:flex items-center justify-between p-4">
                <h1 className="text-xl font-bold">Accueil</h1>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-blue-500 text-sm font-bold hover:underline"
                  >
                    Effacer le filtre
                  </button>
                )}
              </div>
              <div className="flex">
                <button 
                  onClick={() => setFeedType('for-you')}
                  className={`flex-1 py-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors relative font-bold ${feedType === 'for-you' ? '' : 'text-gray-500'}`}
                >
                  Pour vous
                  {feedType === 'for-you' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />}
                </button>
                <button 
                  onClick={() => setFeedType('following')}
                  className={`flex-1 py-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors relative font-bold ${feedType === 'following' ? '' : 'text-gray-500'}`}
                >
                  Abonnements
                  {feedType === 'following' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-blue-500 rounded-full" />}
                </button>
              </div>
            </div>

            <div className="hidden sm:block">
              <TweetComposer 
                currentUser={state.currentUser} 
                onTweet={handlePostTweet} 
                replyingTo={replyingTo}
                replyingToUsername={state.users.find(u => u.id === replyingTo?.userId)?.username || replyingTo?.userId}
                onCancelReply={() => setReplyingTo(null)}
              />
            </div>

            <AnimatePresence mode="popLayout">
              {filteredTweets.map((tweet) => {
                const author = state.users.find(u => u.id === tweet.userId) || 
                              (tweet.userId === state.currentUser?.id ? state.currentUser : null) || {
                  id: tweet.userId,
                  username: 'unknown',
                  displayName: 'Utilisateur inconnu',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown',
                  coverImage: '',
                  bio: '',
                  location: '',
                  joinDate: new Date().toISOString(),
                  followersCount: 0,
                  followingCount: 0,
                  tweetsCount: 0,
                  isVerified: false,
                  email: ''
                };
                return (
                  <TweetCard 
                    key={tweet.id} 
                    tweet={tweet} 
                    author={author} 
                    currentUser={state.currentUser}
                    onLike={(id) => toggleLike(id, state.currentUser!.id)}
                    onRetweet={(id) => toggleRetweet(id, state.currentUser!.id)}
                    onDelete={deleteTweet}
                    onReply={(t) => {
                      setReplyingTo(t);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onProfileClick={handleProfileClick}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        );

      case 'explore':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Chercher sur Twitter"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-2 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-black mb-4">Tendances pour vous</h2>
              <div className="space-y-6">
                {[
                  { id: '1', name: '#ReactJS', tweetCount: '125K' },
                  { id: '2', name: 'TypeScript', tweetCount: '85K' },
                  { id: '3', name: '#WebDevelopment', tweetCount: '45K' },
                  { id: '4', name: 'TailwindCSS', tweetCount: '32K' },
                  { id: '5', name: 'OpenAI', tweetCount: '210K' },
                ].map((trend) => (
                  <div key={trend.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 -mx-4 px-4 py-2 transition-colors">
                    <p className="text-xs text-gray-500">Tendance en France</p>
                    <p className="font-bold">{trend.name}</p>
                    <p className="text-xs text-gray-500">{trend.tweetCount} posts</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800">
            <div className="hidden sm:flex sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-200 dark:border-gray-800 justify-between items-center">
              <h1 className="text-xl font-bold">Notifications</h1>
              <button onClick={markNotificationsRead} className="text-blue-500 text-sm font-bold hover:underline">Tout marquer comme lu</button>
            </div>
            
            <div className="sm:hidden p-4 border-b border-gray-200 dark:border-gray-800 flex justify-end">
              <button onClick={markNotificationsRead} className="text-blue-500 text-sm font-bold hover:underline">Tout marquer comme lu</button>
            </div>
            
            {state.notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <h2 className="text-3xl font-black mb-2">Rien à voir ici — pour l'instant</h2>
                <p className="text-gray-500">Des likes aux retweets et bien plus encore, c'est ici que se passe l'action.</p>
              </div>
            ) : (
              state.notifications.map((n) => {
                const fromUser = state.users.find(u => u.id === n.fromUserId) || {
                  displayName: 'Inconnu',
                  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown'
                } as any;
                return (
                  <div 
                    key={n.id} 
                    onClick={() => handleProfileClick(n.fromUserId)}
                    className={`p-4 border-b border-gray-200 dark:border-gray-800 flex space-x-3 cursor-pointer ${n.isRead ? '' : 'bg-blue-50/30 dark:bg-blue-900/10'}`}
                  >
                    <div className="mt-1">
                      {n.type === 'like' && <Heart className="w-8 h-8 text-pink-500 fill-current" />}
                      {n.type === 'retweet' && <Repeat2 className="w-8 h-8 text-green-500" />}
                      {n.type === 'follow' && <UserPlus className="w-8 h-8 text-blue-500 fill-current" />}
                      {n.type === 'reply' && <MessageCircle className="w-8 h-8 text-blue-500 fill-current" />}
                    </div>
                    <div>
                      <img src={fromUser?.avatar} alt="Avatar" className="w-8 h-8 rounded-full mb-2" />
                      <p className="text-[15px]">
                        <span className="font-bold">{fromUser?.displayName}</span>
                        {n.type === 'like' && ' a aimé votre post'}
                        {n.type === 'retweet' && ' a reposté votre post'}
                        {n.type === 'follow' && ' vous a suivi'}
                        {n.type === 'reply' && ' a répondu à votre post'}
                      </p>
                      {n.tweetId && (
                        <p className="text-gray-500 mt-1 text-sm line-clamp-2">
                          {state.tweets.find(t => t.id === n.tweetId)?.content}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        );

      case 'profile':
        const user = state.users.find(u => u.id === (viewingUserId || state.currentUser?.id)) || state.currentUser!;
        const isOwnProfile = user.id === state.currentUser?.id;
        const isFollowing = state.following.includes(user.id);

        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800">
            <div className="hidden sm:flex sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-2 items-center border-b border-gray-200 dark:border-gray-800">
              <button onClick={() => setActiveTab('home')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors mr-4">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold leading-tight">{user.displayName}</h1>
                <span className="text-gray-500 text-xs">{state.tweets.filter(t => t.userId === user.id).length} posts</span>
              </div>
            </div>

            <div className="relative">
              <div className="h-48 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <img src={user.coverImage} alt="Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute -bottom-16 left-4 p-1 bg-white dark:bg-black rounded-full">
                <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white dark:border-black" />
              </div>
            </div>

            <div className="flex justify-end p-4">
              {isOwnProfile ? (
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 font-bold py-2 px-4 rounded-full transition-colors"
                >
                  Éditer le profil
                </button>
              ) : (
                <button 
                  onClick={() => isFollowing ? unfollowUser(user.id) : followUser(user.id)}
                  className={`font-bold py-2 px-6 rounded-full transition-colors ${
                    isFollowing 
                      ? 'border border-gray-300 dark:border-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 group' 
                      : 'bg-black dark:bg-white text-white dark:text-black'
                  }`}
                >
                  <span className={isFollowing ? 'group-hover:hidden' : ''}>{isFollowing ? 'Abonné' : 'Suivre'}</span>
                  {isFollowing && <span className="hidden group-hover:inline">Ne plus suivre</span>}
                </button>
              )}
            </div>

            <div className="px-4 mt-8">
              <h2 className="text-xl font-black">{user.displayName}</h2>
              <span className="text-gray-500">@{user.username}</span>
              
              <p className="mt-3 text-[15px]">{user.bio || "Pas encore de bio."}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-gray-500 text-sm">
                <div className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {user.location || "Inconnue"}</div>
                <div className="flex items-center"><LinkIcon className="w-4 h-4 mr-1" /> <span className="text-blue-500 hover:underline">{user.website || "x.com"}</span></div>
                <div className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> Inscrit en {new Date(user.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</div>
              </div>

              <div className="flex space-x-4 mt-3 text-sm">
                <div className="hover:underline cursor-pointer"><span className="font-bold text-black dark:text-white">{isOwnProfile ? state.following.length : (user.followingCount || 0)}</span> <span className="text-gray-500">abonnements</span></div>
                <div className="hover:underline cursor-pointer"><span className="font-bold text-black dark:text-white">{user.followersCount + (isFollowing && !isOwnProfile ? 1 : 0)}</span> <span className="text-gray-500">abonnés</span></div>
              </div>
            </div>

            <div className="flex border-b border-gray-200 dark:border-gray-800 mt-4">
              {['Posts', 'Réponses', 'Médias', 'J\'aime'].map((tab, i) => (
                <button key={tab} className={`flex-1 py-4 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors relative font-bold ${i === 0 ? '' : 'text-gray-500'}`}>
                  {tab}
                  {i === 0 && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-500 rounded-full" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="popLayout">
              {state.tweets.filter(t => t.userId === user.id).map((tweet) => (
                <TweetCard 
                  key={tweet.id} 
                  tweet={tweet} 
                  author={user} 
                  currentUser={state.currentUser}
                  onLike={(id) => toggleLike(id, state.currentUser!.id)}
                  onRetweet={(id) => toggleRetweet(id, state.currentUser!.id)}
                  onDelete={deleteTweet}
                  onReply={() => {}}
                  onProfileClick={handleProfileClick}
                />
              ))}
            </AnimatePresence>
          </div>
        );

      case 'explore':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-4 top-2.5 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Chercher sur X" 
                  className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-extrabold mb-4">Tendances pour vous</h2>
              {/* Trends content */}
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="hidden sm:flex sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-200 dark:border-gray-800 justify-between items-center">
              <h1 className="text-xl font-bold">Messages</h1>
              <Settings className="w-5 h-5" />
            </div>
            <div className="flex-1 overflow-y-auto">
              {state.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <h2 className="text-3xl font-black mb-2">Bienvenue dans votre boîte de réception !</h2>
                  <p className="text-gray-500 mb-8">Échangez des messages privés avec d'autres personnes sur X.</p>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors">
                    Nouveau message
                  </button>
                </div>
              ) : (
                state.messages.map((msg) => {
                  const fromUser = state.users.find(u => u.id === msg.senderId) || {
                    displayName: 'Inconnu',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown'
                  } as any;
                  return (
                    <div key={msg.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800 flex space-x-3">
                      <img src={fromUser?.avatar} alt="Avatar" className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-bold">{fromUser?.displayName}</span>
                          <span className="text-gray-500 text-sm">{new Date(msg.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-500 line-clamp-1">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );

      case 'lists':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-xl font-bold">Listes</h1>
            </div>
            <div className="flex flex-col">
              {state.lists.map((list) => (
                <div key={list.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{list.name}</h3>
                    <p className="text-gray-500 text-sm">{list.description}</p>
                    <p className="text-gray-500 text-xs mt-1">{list.userIds.length} membres</p>
                  </div>
                  <button className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">Voir</button>
                </div>
              ))}
              <div className="p-8 text-center border-t border-gray-100 dark:border-gray-800">
                <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Créez vos propres listes</h2>
                <p className="text-gray-500 mb-6">Organisez vos comptes préférés pour ne rien manquer.</p>
                <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full">Nouvelle liste</button>
              </div>
            </div>
          </div>
        );

      case 'communities':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800">
            <div className="sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-xl font-bold">Communautés</h1>
            </div>
            <div className="flex flex-col">
              {state.communities.map((comm) => (
                <div key={comm.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800 flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center text-2xl">
                    {comm.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{comm.name}</h3>
                    <p className="text-gray-500 text-sm">{comm.description}</p>
                    <p className="text-gray-500 text-xs mt-1">{comm.memberCount} membres</p>
                  </div>
                  <button className="border border-gray-300 dark:border-gray-700 px-4 py-1 rounded-full text-sm font-bold">Rejoindre</button>
                </div>
              ))}
              <div className="p-8 text-center border-t border-gray-100 dark:border-gray-800">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Découvrez plus de communautés</h2>
                <p className="text-gray-500 mb-6">Trouvez des personnes qui partagent vos passions.</p>
                <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded-full">Explorer</button>
              </div>
            </div>
          </div>
        );

      case 'grok':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800 flex flex-col">
            <div className="hidden sm:flex sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-200 dark:border-gray-800 justify-between items-center">
              <h1 className="text-xl font-bold flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-blue-500" />
                Twitter AI
              </h1>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {state.grokMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <Sparkles className="w-16 h-16 text-blue-500 mb-4 animate-pulse" />
                  <h2 className="text-2xl font-bold mb-2">Posez n'importe quelle question à l'IA</h2>
                  <p className="text-gray-500">L'IA de Twitter est là pour vous aider à naviguer et comprendre le monde.</p>
                </div>
              ) : (
                state.grokMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-900'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!grokInput.trim()) return;
                  sendGrokMessage(grokInput);
                  setGrokInput('');
                }}
                className="relative"
              >
                <input 
                  type="text" 
                  value={grokInput}
                  onChange={(e) => setGrokInput(e.target.value)}
                  placeholder="Demandez à l'IA..."
                  className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-3 pl-4 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1.5 p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="flex-1 min-h-screen border-r border-gray-200 dark:border-gray-800">
            <div className="hidden sm:flex sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 p-4 border-b border-gray-200 dark:border-gray-800">
              <h1 className="text-xl font-bold">Réglages</h1>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-65px)]">
              <section>
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Apparence</h2>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div>
                    <p className="font-bold">Mode Sombre</p>
                    <p className="text-sm text-gray-500">Basculer entre le thème clair et sombre</p>
                  </div>
                  <button 
                    onClick={toggleTheme}
                    className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    {state.theme === 'light' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6 text-yellow-500" />}
                  </button>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">IA</h2>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="font-bold mb-2">Personnalité de l'IA</p>
                  <div className="grid grid-cols-3 gap-2">
                    {(['helpful', 'sarcastic', 'visionary'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setAiPersonality(p)}
                        className={`py-2 px-3 rounded-lg text-sm font-bold transition-colors ${state.aiPersonality === p ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800'}`}
                      >
                        {p === 'helpful' ? 'Utile' : p === 'sarcastic' ? 'Sarcastique' : 'Visionnaire'}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Compte</h2>
                <button 
                  onClick={logout}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                >
                  <span className="font-bold">Se déconnecter</span>
                  <LogOut className="w-5 h-5" />
                </button>
              </section>

              <section>
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Données</h2>
                <div className="space-y-3">
                  <button 
                    onClick={exportData}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span className="font-bold">Exporter mes données (JSON)</span>
                    <div className="bg-blue-500 text-white p-1 rounded">↓</div>
                  </button>
                  <button 
                    onClick={resetData}
                    className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-500"
                  >
                    <span className="font-bold">Réinitialiser toutes les données</span>
                    <div className="bg-red-500 text-white p-1 rounded">!</div>
                  </button>
                </div>
              </section>
            </div>
          </div>
        );

      default:
        return <div className="flex-1 p-8 text-center">En cours de développement...</div>;
    }
  };

  return (
    <div className={`${state.theme === 'dark' ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen transition-colors duration-200 pb-16 sm:pb-0">
        <MobileHeader 
          currentUser={state.currentUser} 
          onProfileClick={handleProfileClick}
          onSettingsClick={() => setActiveTab('settings')}
          showBack={activeTab !== 'home' && activeTab !== 'explore' && activeTab !== 'notifications' && activeTab !== 'messages'}
          onBack={() => setActiveTab('home')}
          title={activeTab === 'profile' ? 'Profil' : activeTab === 'settings' ? 'Réglages' : activeTab === 'notifications' ? 'Notifications' : activeTab === 'messages' ? 'Messages' : undefined}
        />
        
        <div className="max-w-[1300px] mx-auto flex justify-center">
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'profile') setViewingUserId(state.currentUser?.id || null);
            }} 
            currentUser={state.currentUser} 
            onLogout={logout}
            theme={state.theme}
            onToggleTheme={toggleTheme}
            unreadNotifications={unreadNotifications}
          />
          
          <main className="flex-1 max-w-[600px] min-h-screen border-r border-gray-200 dark:border-gray-800">
            {renderContent()}
          </main>

          <RightPanel 
            users={state.users} 
            currentUser={state.currentUser}
            following={state.following}
            onFollow={followUser}
            onUnfollow={unfollowUser}
            onProfileClick={handleProfileClick}
            onTrendClick={(trend) => {
              setSearchQuery(trend);
              setActiveTab('home');
              window.scrollTo(0, 0);
            }}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      <MobileNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        unreadNotifications={unreadNotifications} 
      />

      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => setIsMobileComposeOpen(true)}
        className="sm:hidden fixed bottom-20 right-4 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 transition-transform active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Mobile Compose Modal */}
      <AnimatePresence>
        {isMobileComposeOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="sm:hidden fixed inset-0 bg-white dark:bg-black z-[100] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <button onClick={() => { setIsMobileComposeOpen(false); setReplyingTo(null); }} className="text-gray-900 dark:text-gray-100 font-bold">Annuler</button>
              <div className="text-blue-500 font-bold">Nouveau Post</div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <TweetComposer 
                currentUser={state.currentUser} 
                onTweet={(content, media) => {
                  handlePostTweet(content, media);
                  setIsMobileComposeOpen(false);
                }}
                replyingTo={replyingTo}
                replyingToUsername={state.users.find(u => u.id === replyingTo?.userId)?.username || replyingTo?.userId}
                onCancelReply={() => setReplyingTo(null)}
                placeholder="Quoi de neuf ?"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditModalOpen && (
        <EditProfileModal 
          user={state.currentUser} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={updateProfile} 
        />
      )}
    </div>
  );
}
