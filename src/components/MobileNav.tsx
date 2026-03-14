import React from 'react';
import { Home, Search, Bell, Mail } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotifications: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, unreadNotifications }) => {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-3 z-50">
      <button onClick={() => setActiveTab('home')} className="p-2">
        <Home className={`w-7 h-7 ${activeTab === 'home' ? 'text-blue-500 fill-current' : 'text-gray-900 dark:text-gray-100'}`} />
      </button>
      <button onClick={() => setActiveTab('explore')} className="p-2">
        <Search className={`w-7 h-7 ${activeTab === 'explore' ? 'text-blue-500 stroke-[3px]' : 'text-gray-900 dark:text-gray-100'}`} />
      </button>
      <button onClick={() => setActiveTab('notifications')} className="p-2 relative">
        <Bell className={`w-7 h-7 ${activeTab === 'notifications' ? 'text-blue-500 fill-current' : 'text-gray-900 dark:text-gray-100'}`} />
        {unreadNotifications > 0 && (
          <span className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-black">
            {unreadNotifications > 9 ? '9+' : unreadNotifications}
          </span>
        )}
      </button>
      <button onClick={() => setActiveTab('messages')} className="p-2">
        <Mail className={`w-7 h-7 ${activeTab === 'messages' ? 'text-blue-500 fill-current' : 'text-gray-900 dark:text-gray-100'}`} />
      </button>
    </div>
  );
};
