import { useState } from 'react';
import { ArrowLeft, Heart, X, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface User {
  id: number;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  interests?: string[];
}

interface SwipeCardProps {
  user: User | undefined;
  onSwipe: (isLike: boolean) => void;
  onBack: () => void;
  hasMore: boolean;
  currentIndex: number;
  totalUsers: number;
}

export function SwipeCard({ user, onSwipe, onBack, hasMore, currentIndex, totalUsers }: SwipeCardProps) {
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSwipe = (isLike: boolean) => {
    setSwipeDirection(isLike ? 'right' : 'left');
    setIsAnimating(true);
    setTimeout(() => {
      onSwipe(isLike);
      setSwipeDirection(null);
      setShowInfo(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleReport = () => {
    alert('Жалоба отправлена. Спасибо за заботу о безопасности сообщества!');
  };

  if (!user) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="text-6xl mb-4">😊</div>
            <h2 className="text-2xl text-white mb-4">Пользователи закончились!</h2>
            <p className="text-pink-200 mb-8">Попробуйте вернуться позже</p>
            <Button
              onClick={onBack}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white"
            >
              На главную
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl text-white">Поиск</h1>
            <p className="text-pink-200 text-sm">{currentIndex + 1} из {totalUsers}</p>
          </div>
          <Button
            onClick={() => setShowInfo(!showInfo)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <Info className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mb-6 backdrop-blur-xl bg-white/10 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalUsers) * 100}%` }}
          />
        </div>

        {/* Card */}
        <div 
          key={user.id}
          className={`relative transition-all duration-300 ${
            isAnimating 
              ? swipeDirection === 'left' 
                ? 'opacity-0 -translate-x-full rotate-[-45deg]' 
                : 'opacity-0 translate-x-full rotate-[45deg]'
              : 'opacity-100 translate-x-0 rotate-0'
          }`}
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            {/* Photo */}
            <div className="relative h-96 overflow-hidden">
              <img
                src={user.photoUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* User info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h2 className="text-3xl mb-1">{user.name}, {user.age}</h2>
                {user.interests && user.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.interests.slice(0, 3).map((interest) => (
                      <Badge key={interest} className="bg-white/20 text-white border-0">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="p-6">
              <p className="text-white/90">{user.bio}</p>
              
              {showInfo && user.interests && user.interests.length > 3 && (
                <div className="mt-4 pt-4 border-t border-white/20 animate-in fade-in slide-in-from-top duration-300">
                  <p className="text-pink-200 text-sm mb-2">Все интересы:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="border-white/30 text-white">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Swipe indicators */}
          {swipeDirection === 'right' && (
            <div className="absolute top-8 left-0 right-0 flex justify-center animate-in fade-in zoom-in duration-200">
              <div className="bg-green-500 text-white px-8 py-4 rounded-full shadow-2xl">
                <Heart className="w-12 h-12" fill="white" />
              </div>
            </div>
          )}
          {swipeDirection === 'left' && (
            <div className="absolute top-8 left-0 right-0 flex justify-center animate-in fade-in zoom-in duration-200">
              <div className="bg-red-500 text-white px-8 py-4 rounded-full shadow-2xl">
                <X className="w-12 h-12" />
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <Button
            onClick={() => handleSwipe(false)}
            size="icon"
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-red-500 border border-white/30 text-white shadow-xl hover:scale-110 transition-all duration-300 disabled:opacity-50"
          >
            <X className="w-8 h-8" />
          </Button>

          <Button
            onClick={() => handleSwipe(true)}
            size="icon"
            disabled={isAnimating}
            className="w-20 h-20 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 disabled:opacity-50"
          >
            <Heart className="w-10 h-10" fill="white" />
          </Button>

          <Button
            onClick={handleReport}
            size="icon"
            variant="ghost"
            disabled={isAnimating}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white shadow-xl hover:scale-110 transition-all duration-300 disabled:opacity-50"
          >
            <AlertCircle className="w-6 h-6" />
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-pink-200 text-sm">Свайпните влево или вправо</p>
          <div className="flex justify-center gap-6 text-xs text-pink-300">
            <span>← Пропустить</span>
            <span>Лайкнуть →</span>
          </div>
        </div>
      </div>
    </div>
  );
}
