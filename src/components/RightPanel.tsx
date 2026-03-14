import React from 'react';
import { Search, Settings, MoreHorizontal } from 'lucide-react';
import { TRENDS } from '../constants';
import { User } from '../types';

interface RightPanelProps {
  users: User[];
  currentUser: User | null;
  following: string[];
  onFollow: (id: string) => void;
  onUnfollow: (id: string) => void;
  onProfileClick: (userId: string) => void;
  onTrendClick: (trend: string) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export const RightPanel: React.FC<RightPanelProps> = ({ 
  users, 
  currentUser, 
  following, 
  onFollow, 
  onUnfollow,
  onProfileClick,
  onTrendClick,
  onSearch,
  searchQuery
}) => {
  const suggestedUsers = users
    .filter(u => u.id !== currentUser?.id && !following.includes(u.id))
    .slice(0, 3);

  return (
    <div className="hidden lg:flex flex-col w-[350px] h-screen sticky top-0 p-4 space-y-4 overflow-y-auto">
      <div className="relative group">
        <Search className="absolute left-4 top-3 w-5 h-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Chercher sur X" 
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-xl font-extrabold">Tendances pour vous</h2>
          <Settings className="w-5 h-5 text-gray-500 cursor-pointer" />
        </div>
        
        {TRENDS.map((trend) => (
          <div 
            key={trend.id} 
            onClick={() => onTrendClick(trend.name)}
            className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <span className="text-gray-500 text-sm">Tendances</span>
              <MoreHorizontal className="w-4 h-4 text-gray-500 group-hover:text-blue-500" />
            </div>
            <p className="font-bold">{trend.name}</p>
            <span className="text-gray-500 text-sm">{trend.tweetCount} posts</span>
          </div>
        ))}
        
        <button className="w-full text-left px-4 py-4 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          Voir plus
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
        <h2 className="text-xl font-extrabold px-4 py-3">Suggestions</h2>
        
        {suggestedUsers.map((user) => (
          <div 
            key={user.id} 
            onClick={() => onProfileClick(user.id)}
            className="flex items-center justify-between px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="flex items-center">
              <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
              <div className="ml-3 flex flex-col">
                <span className="font-bold text-sm hover:underline">{user.displayName}</span>
                <span className="text-gray-500 text-sm">@{user.username}</span>
              </div>
            </div>
            <button 
              onClick={() => onFollow(user.id)}
              className="bg-black dark:bg-white text-white dark:text-black font-bold py-1.5 px-4 rounded-full text-sm hover:opacity-80 transition-opacity"
            >
              Suivre
            </button>
          </div>
        ))}

        <button className="w-full text-left px-4 py-4 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          Voir plus
        </button>
      </div>

      <div className="px-4 text-gray-500 text-xs flex flex-wrap gap-x-3 gap-y-1">
        <span>Conditions d'utilisation</span>
        <span>Politique de Confidentialité</span>
        <span>Politique relative aux cookies</span>
        <span>Accessibilité</span>
        <span>Informations sur les publicités</span>
        <span>Plus...</span>
        <span>© 2026 X Corp.</span>
      </div>
    </div>
  );
};
