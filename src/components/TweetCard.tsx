import React, { useState } from 'react';
import { 
  MessageCircle, 
  Repeat2, 
  Heart, 
  Share, 
  MoreHorizontal, 
  CheckCircle2,
  Trash2,
  Pin,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Tweet, User } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface TweetCardProps {
  tweet: Tweet;
  author: User;
  currentUser: User | null;
  onLike: (id: string) => void;
  onRetweet: (id: string) => void;
  onDelete: (id: string) => void;
  onReply: (tweet: Tweet) => void;
  onProfileClick: (userId: string) => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
  onPin?: (id: string) => void;
  isPinned?: boolean;
}

export const TweetCard: React.FC<TweetCardProps> = ({ 
  tweet, 
  author, 
  currentUser, 
  onLike, 
  onRetweet, 
  onDelete,
  onReply,
  onProfileClick,
  onBookmark,
  isBookmarked = false,
  onPin,
  isPinned = false
}) => {
  const [isLiked, setIsLiked] = useState(tweet.likes.includes(currentUser?.id || ''));
  const [isRetweeted, setIsRetweeted] = useState(tweet.retweets.includes(currentUser?.id || ''));
  const [likesCount, setLikesCount] = useState(tweet.likes.length);
  const [retweetsCount, setRetweetsCount] = useState(tweet.retweets.length);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    onLike(tweet.id);
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleRetweet = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    onRetweet(tweet.id);
    setIsRetweeted(!isRetweeted);
    setRetweetsCount(prev => isRetweeted ? prev - 1 : prev + 1);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(tweet.id);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer"
    >
      {tweet.isPinned && (
        <div className="flex items-center text-gray-500 text-xs font-bold mb-2 ml-8">
          <Pin className="w-3 h-3 mr-2 fill-current" />
          <span>Tweet épinglé</span>
        </div>
      )}
      
      <div className="flex space-x-3">
        <img 
          src={author.avatar} 
          alt={author.username} 
          onClick={(e) => { e.stopPropagation(); onProfileClick(author.id); }}
          className="w-12 h-12 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div 
              onClick={(e) => { e.stopPropagation(); onProfileClick(author.id); }}
              className="flex items-center space-x-1 truncate cursor-pointer"
            >
              <span className="font-bold hover:underline truncate">{author.displayName}</span>
              {author.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-500 fill-current" />}
              <span className="text-gray-500 truncate">@{author.username}</span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 text-sm">
                {formatDistanceToNow(new Date(tweet.timestamp), { addSuffix: true, locale: fr })}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {currentUser?.id === author.id && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onPin?.(tweet.id); }}
                  className={`p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors ${isPinned ? 'text-blue-500' : 'text-gray-500'}`}
                  title={isPinned ? "Désépingler" : "Épingler"}
                >
                  <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
                </button>
              )}
              {currentUser?.id === author.id && (
                <button 
                  onClick={handleDelete}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-500 hover:text-red-500 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-500 hover:text-blue-500 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          <p className="mt-1 text-[15px] leading-normal whitespace-pre-wrap break-words">
            {tweet.content}
          </p>

          {tweet.media && tweet.media.length > 0 && (
            <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <img 
                src={tweet.media[0]} 
                alt="Media" 
                className="w-full h-auto max-h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-3 max-w-md text-gray-500">
            <button 
              onClick={(e) => { e.stopPropagation(); onReply(tweet); }}
              className="flex items-center space-x-2 group"
            >
              <div className="p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 rounded-full transition-colors">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="text-xs group-hover:text-blue-500">{tweet.replies.length}</span>
            </button>

            <button 
              onClick={handleRetweet}
              className={`flex items-center space-x-2 group ${isRetweeted ? 'text-green-500' : ''}`}
            >
              <div className="p-2 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-green-500 rounded-full transition-colors">
                <Repeat2 className={`w-4 h-4 ${isRetweeted ? 'stroke-[3px]' : ''}`} />
              </div>
              <span className="text-xs group-hover:text-green-500">{retweetsCount}</span>
            </button>

            <button 
              onClick={handleLike}
              className={`flex items-center space-x-2 group ${isLiked ? 'text-pink-500' : ''}`}
            >
              <div className="p-2 group-hover:bg-pink-50 dark:group-hover:bg-pink-900/20 group-hover:text-pink-500 rounded-full transition-colors">
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-xs group-hover:text-pink-500">{likesCount}</span>
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.(tweet.id);
              }}
              className={`flex items-center space-x-2 group ${isBookmarked ? 'text-blue-500' : ''}`}
            >
              <div className="p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 rounded-full transition-colors">
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </div>
            </button>

            <button className="flex items-center space-x-2 group">
              <div className="p-2 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500 rounded-full transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
