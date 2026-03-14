import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { User } from '../types';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || '');
  const [location, setLocation] = useState(user.location || '');
  const [website, setWebsite] = useState(user.website || '');
  const [avatar, setAvatar] = useState(user.avatar);
  const [coverImage, setCoverImage] = useState(user.coverImage);

  const handleSave = () => {
    onSave({
      ...user,
      displayName,
      bio,
      location,
      website,
      avatar,
      coverImage
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-black w-full max-w-xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full transition-colors mr-4">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold">Éditer le profil</h2>
          </div>
          <button 
            onClick={handleSave}
            className="bg-black dark:bg-white text-white dark:text-black font-bold py-1.5 px-4 rounded-full hover:opacity-80 transition-opacity"
          >
            Enregistrer
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="relative h-48 bg-gray-200 dark:bg-gray-800 group cursor-pointer">
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-3 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors">
                <Camera className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="px-4 relative">
            <div className="absolute -top-16 left-4 p-1 bg-white dark:bg-black rounded-full group cursor-pointer">
              <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-white dark:border-black opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-3 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors">
                  <Camera className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="mt-20 space-y-6 pb-8">
              <div className="relative border border-gray-300 dark:border-gray-700 rounded-md p-2 focus-within:border-blue-500 transition-colors">
                <label className="block text-xs text-gray-500">Nom</label>
                <input 
                  type="text" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-transparent outline-none pt-1"
                />
              </div>

              <div className="relative border border-gray-300 dark:border-gray-700 rounded-md p-2 focus-within:border-blue-500 transition-colors">
                <label className="block text-xs text-gray-500">Bio</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-transparent outline-none pt-1 resize-none h-24"
                />
              </div>

              <div className="relative border border-gray-300 dark:border-gray-700 rounded-md p-2 focus-within:border-blue-500 transition-colors">
                <label className="block text-xs text-gray-500">Localisation</label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent outline-none pt-1"
                />
              </div>

              <div className="relative border border-gray-300 dark:border-gray-700 rounded-md p-2 focus-within:border-blue-500 transition-colors">
                <label className="block text-xs text-gray-500">Site Web</label>
                <input 
                  type="text" 
                  value={website} 
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-transparent outline-none pt-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
