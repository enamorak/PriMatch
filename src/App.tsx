import { useState } from 'react';
import { Home } from './components/Home';
import { ProfileForm } from './components/ProfileForm';
import { SwipeCard } from './components/SwipeCard';
import { Matches } from './components/Matches';
import { Chat } from './components/Chat';
import { Settings } from './components/Settings';
import { spoonOS } from './services/spoonos';

type Screen = 'home' | 'profile' | 'swipe' | 'matches' | 'chat' | 'settings';

interface User {
  id: number;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  interests?: string[];
}

interface Match {
  id: number;
  user: User;
  matchedAt: Date;
  compatibilityScore?: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);

  // Mock users for swiping
  const [mockUsers] = useState<User[]>([
    {
      id: 2,
      name: 'София',
      age: 24,
      bio: 'Люблю путешествия, йогу и хороший кофе. Ищу искренние отношения 🌸',
      photoUrl: 'https://de.pinterest.com/pin/700661654513006317/',
      interests: ['путешествия', 'йога', 'кофе', 'природа']
    },
    {
      id: 3,
      name: 'Алексей',
      age: 28,
      bio: 'Разработчик, музыкант в свободное время. Обожаю концерты и новые знакомства 🎸',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      interests: ['музыка', 'программирование', 'концерты', 'гитара']
    },
    {
      id: 4,
      name: 'Екатерина',
      age: 26,
      bio: 'Фотограф и любитель искусства. Вдохновляюсь красотой вокруг 📸',
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      interests: ['фотография', 'искусство', 'музеи', 'дизайн']
    },
    {
      id: 5,
      name: 'Дмитрий',
      age: 30,
      bio: 'Спортсмен, предприниматель. Ценю честность и чувство юмора 💪',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      interests: ['спорт', 'бизнес', 'фитнес', 'мотивация']
    },
    {
      id: 6,
      name: 'Анна',
      age: 27,
      bio: 'Дизайнер интерьеров. Создаю уют и красоту. Люблю вечера с книгой 📚',
      photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
      interests: ['дизайн', 'архитектура', 'книги', 'творчество']
    },
    {
      id: 7,
      name: 'Максим',
      age: 29,
      bio: 'Шеф-повар, гурман. Готовлю с душой, путешествую за вкусами 🍳',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      interests: ['кулинария', 'путешествия', 'рестораны', 'вино']
    }
  ]);

  const [currentSwipeIndex, setCurrentSwipeIndex] = useState(0);
  const [rejectedUsers, setRejectedUsers] = useState<number[]>([]);

  const handleProfileCreate = async (profile: Omit<User, 'id'>) => {
    // Encrypt profile data using Spoon OS
    let encryptedBio = profile.bio;
    if (encryptionEnabled) {
      const result = await spoonOS.encryptInEnclave(profile.bio);
      if (result.success) {
        encryptedBio = result.encryptedData;
        console.log(`✅ Profile encrypted using ${result.usedEnclave ? 'Spoon OS Enclave' : 'Local encryption'}`);
      }
    }

    const newUser: User = {
      id: 1,
      ...profile
    };
    setCurrentUser(newUser);
    setCurrentScreen('home');
  };

  const handleSwipe = async (isLike: boolean) => {
    const currentUserData = mockUsers[currentSwipeIndex];
    
    if (isLike && currentUserData) {
      // Calculate compatibility using Spoon OS
      const compatibility = await spoonOS.calculateCompatibility(
        currentUser || { age: 25 },
        currentUserData
      );

      // Simulate match (70% chance for likes)
      if (Math.random() > 0.3) {
        const newMatch: Match = {
          id: matches.length + 1,
          user: currentUserData,
          matchedAt: new Date(),
          compatibilityScore: compatibility.score
        };
        setMatches([...matches, newMatch]);
      }
    } else {
      setRejectedUsers([...rejectedUsers, currentUserData?.id || 0]);
    }
    
    setCurrentSwipeIndex(currentSwipeIndex + 1);
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setCurrentScreen('chat');
  };

  const handleBackFromChat = () => {
    setSelectedMatch(null);
    setCurrentScreen('matches');
  };

  const handleDeleteMatch = (matchId: number) => {
    setMatches(matches.filter(m => m.id !== matchId));
  };

  const handleCreateMockUsers = () => {
    console.log('✅ Mock users already created:', mockUsers.length);
    alert(`${mockUsers.length} тестовых пользователей готовы для свайпинга!`);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home
            hasProfile={!!currentUser}
            onCreateProfile={() => setCurrentScreen('profile')}
            onFindMatches={() => {
              setCurrentSwipeIndex(0);
              setCurrentScreen('swipe');
            }}
            onViewMatches={() => setCurrentScreen('matches')}
            onSettings={() => setCurrentScreen('settings')}
            onCreateMockUsers={handleCreateMockUsers}
            matchCount={matches.length}
            userName={currentUser?.name}
          />
        );
      case 'profile':
        return (
          <ProfileForm
            existingProfile={currentUser}
            onSubmit={handleProfileCreate}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'swipe':
        return (
          <SwipeCard
            user={mockUsers[currentSwipeIndex]}
            onSwipe={handleSwipe}
            onBack={() => setCurrentScreen('home')}
            hasMore={currentSwipeIndex < mockUsers.length - 1}
            currentIndex={currentSwipeIndex}
            totalUsers={mockUsers.length}
          />
        );
      case 'matches':
        return (
          <Matches
            matches={matches}
            onMatchSelect={handleMatchSelect}
            onDeleteMatch={handleDeleteMatch}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'chat':
        return selectedMatch ? (
          <Chat
            match={selectedMatch}
            currentUserId={currentUser?.id || 1}
            currentUserName={currentUser?.name || 'Вы'}
            onBack={handleBackFromChat}
          />
        ) : null;
      case 'settings':
        return (
          <Settings
            encryptionEnabled={encryptionEnabled}
            onEncryptionToggle={setEncryptionEnabled}
            onBack={() => setCurrentScreen('home')}
            onClearMatches={() => setMatches([])}
            onResetSwipes={() => {
              setCurrentSwipeIndex(0);
              setRejectedUsers([]);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {renderScreen()}
      </div>
    </div>
  );
}