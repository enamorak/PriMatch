import { ArrowLeft, MessageCircle, Trash2, TrendingUp } from 'lucide-react';
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

interface Match {
  id: number;
  user: User;
  matchedAt: Date;
  compatibilityScore?: number;
}

interface MatchesProps {
  matches: Match[];
  onMatchSelect: (match: Match) => void;
  onDeleteMatch: (matchId: number) => void;
  onBack: () => void;
}

export function Matches({ matches, onMatchSelect, onDeleteMatch, onBack }: MatchesProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} д. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    return 'Только что';
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl text-white">Мои мэтчи</h1>
            <p className="text-pink-200 text-sm">{matches.length} совпадений</p>
          </div>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="text-6xl mb-4">💫</div>
              <h2 className="text-2xl text-white mb-4">Пока нет мэтчей</h2>
              <p className="text-pink-200 mb-8">Начните свайпать, чтобы найти совпадения!</p>
              <Button
                onClick={onBack}
                className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white"
              >
                Найти совпадения
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => (
              <div
                key={match.id}
                className="backdrop-blur-xl bg-white/10 rounded-3xl overflow-hidden border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div 
                  className="relative h-64 overflow-hidden"
                  onClick={() => onMatchSelect(match)}
                >
                  <img
                    src={match.user.photoUrl}
                    alt={match.user.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Match indicator */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm shadow-lg">
                      ✨ Совпадение!
                    </div>
                  </div>

                  {/* Compatibility score */}
                  {match.compatibilityScore && (
                    <div className="absolute top-4 left-4">
                      <div className="backdrop-blur-xl bg-white/20 border border-white/30 text-white px-3 py-2 rounded-full text-sm flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {match.compatibilityScore}%
                      </div>
                    </div>
                  )}

                  {/* User info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl mb-1">{match.user.name}, {match.user.age}</h3>
                    <p className="text-sm text-white/80 line-clamp-2">{match.user.bio}</p>
                    {match.user.interests && match.user.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {match.user.interests.slice(0, 2).map((interest) => (
                          <Badge key={interest} className="bg-white/20 text-white border-0 text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-pink-200 mt-2">{formatTime(match.matchedAt)}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="p-4 bg-white/5 flex gap-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMatchSelect(match);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Написать
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-red-500/20 hover:text-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Удалить этот мэтч?')) {
                        onDeleteMatch(match.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security notice */}
        {matches.length > 0 && (
          <div className="mt-8 backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20 text-center">
            <p className="text-pink-100 text-sm">
              🔐 Все сообщения зашифрованы end-to-end через Spoon OS
            </p>
          </div>
        )}
      </div>
    </div>
  );
}