import React, { useState } from 'react';
import { Twitter, Mail, Lock, User as UserIcon, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  onSignup: (user: User) => void;
  users: User[];
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, users }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const user = users.find(u => (u.email === email || u.username === email));
      if (user) {
        onLogin(user);
      } else {
        setError('Identifiants incorrects');
      }
    } else {
      if (!email || !password || !username || !displayName) {
        setError('Tous les champs sont obligatoires');
        return;
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        displayName,
        email,
        bio: '',
        location: '',
        joinDate: new Date().toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        coverImage: 'https://picsum.photos/seed/default/1500/500',
        followersCount: 0,
        followingCount: 0,
        tweetsCount: 0,
        isVerified: false
      };
      onSignup(newUser);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-black text-black dark:text-white">
      <div className="hidden lg:flex flex-1 items-center justify-center bg-blue-500">
        <Twitter className="w-1/2 h-1/2 text-white fill-current" />
      </div>

      <div className="flex-1 flex flex-col p-8 lg:p-16 justify-center max-w-2xl mx-auto w-full">
        <Twitter className="w-10 h-10 text-blue-500 fill-current mb-12 lg:hidden" />
        
        <h1 className="text-4xl lg:text-6xl font-black mb-12 tracking-tight">
          Ça se passe maintenant
        </h1>

        <h2 className="text-2xl lg:text-3xl font-black mb-8">
          {isLogin ? 'Connectez-vous à Twitter' : 'Rejoignez Twitter dès aujourd\'hui'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
          {!isLogin && (
            <>
              <div className="relative">
                <UserIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Nom d'affichage"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-bold">@</span>
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Email ou nom d'utilisateur"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-md py-3 pl-12 pr-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full transition-colors shadow-sm"
          >
            {isLogin ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>

        <div className="mt-12 max-w-md">
          <p className="text-gray-500 mb-4">
            {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-blue-500 font-bold py-3 rounded-full transition-colors"
          >
            {isLogin ? 'S\'inscrire' : 'Se connecter'}
          </button>
        </div>

        <div className="mt-8 text-xs text-gray-500 max-w-md">
          En vous inscrivant, vous acceptez les Conditions d'utilisation et la Politique de confidentialité, notamment l'Utilisation des cookies.
        </div>
      </div>
    </div>
  );
};
