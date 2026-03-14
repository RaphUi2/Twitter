import React, { useState, useRef } from 'react';
import { Image, Smile, Calendar, MapPin, List, BarChart2 } from 'lucide-react';
import { User, Tweet } from '../types';
import { X } from 'lucide-react';

interface TweetComposerProps {
  currentUser: User | null;
  onTweet: (content: string, media?: string[]) => void;
  placeholder?: string;
  replyingTo?: Tweet | null;
  replyingToUsername?: string;
  onCancelReply?: () => void;
  quotingTweet?: Tweet | null;
  quotingTweetUsername?: string;
  onCancelQuote?: () => void;
}

export const TweetComposer: React.FC<TweetComposerProps> = ({ 
  currentUser, 
  onTweet, 
  placeholder = "Quoi de neuf ?",
  replyingTo,
  replyingToUsername,
  onCancelReply,
  quotingTweet,
  quotingTweetUsername,
  onCancelQuote
}) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTweet = () => {
    if (content.trim() || content.length > 280) {
      onTweet(content);
      setContent('');
    }
  };

  const charCount = content.length;
  const isOverLimit = charCount > 280;

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col">
      {replyingTo && (
        <div className="flex flex-col mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>En réponse à</span>
              <span className="text-blue-500 font-bold">@{replyingToUsername}</span>
            </div>
            <button 
              onClick={onCancelReply}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 italic">
            "{replyingTo.content}"
          </p>
        </div>
      )}
      
      <div className="flex space-x-3">
        <img 
          src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} 
          alt="Avatar" 
          className="w-12 h-12 rounded-full"
        />
        
        <div className="flex-1 flex flex-col">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={replyingTo ? "Poster votre réponse" : quotingTweet ? "Ajouter un commentaire" : placeholder}
            className="w-full bg-transparent text-xl outline-none resize-none pt-2 min-h-[50px] placeholder-gray-500"
            rows={isFocused || replyingTo || quotingTweet ? 3 : 1}
          />

          {quotingTweet && (
            <div className="mt-2 p-3 border border-gray-200 dark:border-gray-800 rounded-2xl relative">
              <button 
                onClick={onCancelQuote}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white hover:bg-black/70 rounded-full transition-colors z-10"
              >
                <X className="w-3 h-3" />
              </button>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-bold text-sm">@{quotingTweetUsername}</span>
              </div>
              <p className="text-sm line-clamp-2 text-gray-600 dark:text-gray-400">
                {quotingTweet.content}
              </p>
            </div>
          )}
          
          <div className={`flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-900 transition-opacity ${isFocused || replyingTo ? 'opacity-100' : 'opacity-100'}`}>
          <div className="flex items-center space-x-1 text-blue-500">
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
              <Image className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
              <List className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
              <Calendar className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors opacity-50 cursor-not-allowed">
              <MapPin className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-4">
            {content.length > 0 && (
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      className="text-gray-200 dark:text-gray-800"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      strokeDasharray={88}
                      strokeDashoffset={88 - (Math.min(charCount, 280) / 280) * 88}
                      className={isOverLimit ? 'text-red-500' : charCount > 260 ? 'text-yellow-500' : 'text-blue-500'}
                    />
                  </svg>
                  {charCount > 260 && (
                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                      {280 - charCount}
                    </span>
                  )}
                </div>
                <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-800" />
              </div>
            )}
            
            <button
              disabled={!content.trim() || isOverLimit}
              onClick={handleTweet}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
              Poster
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
