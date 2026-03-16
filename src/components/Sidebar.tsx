import React from 'react';
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  User as UserIcon, 
  MoreHorizontal, 
  LogOut,
  Moon,
  Sun,
  Settings,
  List as ListIcon,
  Bookmark,
  Sparkles,
  Users,
  Plus,
  Twitter
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  unreadNotifications: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  onLogout,
  theme,
  onToggleTheme,
  unreadNotifications
}) => {
  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'explore', label: 'Explorer', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'messages', label: 'Messages', icon: Mail },
    { id: 'grok', label: 'Twitter AI', icon: Sparkles },
    { id: 'bookmarks', label: 'Signets', icon: Bookmark },
    { id: 'lists', label: 'Listes', icon: ListIcon },
    { id: 'communities', label: 'Communautés', icon: Users },
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'settings', label: 'Réglages', icon: Settings },
  ];

  return (
    <div className="hidden sm:flex flex-col h-screen sticky top-0 px-2 xl:px-4 py-2 justify-between border-r border-gray-200 dark:border-gray-800">
      <div className="flex flex-col items-center xl:items-start">
        <div className="p-3 mb-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors cursor-pointer">
          <Twitter className="w-8 h-8 text-blue-500 fill-current" />
        </div>

        <nav className="space-y-1 w-full">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center p-3 rounded-full transition-colors w-full group ${
                activeTab === item.id 
                  ? 'font-bold' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-7 h-7 ${activeTab === item.id ? 'text-blue-500' : 'text-gray-900 dark:text-gray-100'}`} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-black">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span className={`hidden xl:block ml-4 text-xl ${activeTab === item.id ? 'text-blue-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 xl:px-24 rounded-full transition-colors shadow-sm w-fit xl:w-full flex items-center justify-center">
          <span className="hidden xl:block">Poster</span>
          <Plus className="xl:hidden w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col space-y-4 mb-4 items-center xl:items-stretch">
        <button 
          onClick={onLogout}
          className="p-3 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors text-red-500 flex items-center"
        >
          <LogOut className="w-7 h-7" />
          <span className="hidden xl:block ml-4 font-bold">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};
