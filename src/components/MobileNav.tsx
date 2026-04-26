import React from 'react';
import { Home, Search, Bell, Mail, Sparkles, Users } from 'lucide-react';
import { motion } from 'motion/react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotifications: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, unreadNotifications }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'explore', icon: Search, label: 'Explorer' },
    { id: 'grok', icon: Sparkles, label: 'IA' },
    { id: 'communities', icon: Users, label: 'Communautés' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: unreadNotifications },
    { id: 'messages', icon: Mail, label: 'Messages' },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-black/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 flex justify-between items-center px-2 py-1 z-50 h-14">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id)} 
            className="relative flex flex-col items-center justify-center flex-1 h-full py-1"
          >
            <motion.div
              animate={{ scale: isActive ? 1.1 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="relative"
            >
              <item.icon 
                className={`w-[22px] h-[22px] ${isActive ? 'text-blue-500 fill-current' : 'text-gray-600 dark:text-gray-400'}`} 
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-black min-w-[18px] flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </motion.div>
            
            {isActive && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
