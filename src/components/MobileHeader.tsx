import React from 'react';
import { Twitter, Settings, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface MobileHeaderProps {
  currentUser: User | null;
  onProfileClick: (userId: string) => void;
  onSettingsClick: () => void;
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ 
  currentUser, 
  onProfileClick, 
  onSettingsClick,
  showBack,
  onBack,
  title
}) => {
  return (
    <div className="sm:hidden sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-md z-40 flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center">
        {showBack ? (
          <button onClick={onBack} className="mr-6">
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <img 
            src={currentUser?.avatar} 
            alt="Profile" 
            onClick={() => currentUser && onProfileClick(currentUser.id)}
            className="w-8 h-8 rounded-full cursor-pointer mr-4"
          />
        )}
        {title && <h1 className="text-xl font-bold">{title}</h1>}
      </div>
      {!title && <Twitter className="w-7 h-7 text-blue-500 fill-current" />}
      <button onClick={onSettingsClick}>
        <Settings className="w-6 h-6 text-gray-900 dark:text-gray-100" />
      </button>
    </div>
  );
};
