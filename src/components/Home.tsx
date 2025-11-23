import { Heart, Users, Sparkles, Settings as SettingsIcon, UserPlus } from 'lucide-react';
import { Button } from './ui/button';

interface HomeProps {
  hasProfile: boolean;
  onCreateProfile: () => void;
  onFindMatches: () => void;
  onViewMatches: () => void;
  onSettings: () => void;
  onCreateMockUsers: () => void;
  matchCount: number;
  userName?: string;
}

export function Home({ 
  hasProfile, 
  onCreateProfile, 
  onFindMatches, 
  onViewMatches, 
  onSettings,
  onCreateMockUsers,
  matchCount,
  userName 
}: HomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 mb-6 shadow-2xl hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Heart className="w-10 h-10 text-white" fill="white" />
          </div>
          <h1 className="text-5xl text-white mb-3 tracking-tight">PriMatch</h1>
          <p className="text-pink-200 text-lg">Защищенные знакомства</p>
          {userName && (
            <p className="text-fuchsia-300 mt-2">Привет, {userName}! 👋</p>
          )}
        </div>

        {/* Glass morphism card */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-4">
            {!hasProfile ? (
              <Button
                onClick={onCreateProfile}
                className="w-full h-14 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Создать профиль
              </Button>
            ) : (
              <>
                <Button
                  onClick={onFindMatches}
                  className="w-full h-14 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Найти совпадения
                </Button>

                <Button
                  onClick={onViewMatches}
                  className="w-full h-14 bg-white/20 hover:bg-white/30 text-white border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Мои мэтчи
                  {matchCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-7 h-7 flex items-center justify-center shadow-lg animate-pulse">
                      {matchCount}
                    </span>
                  )}
                </Button>

                <Button
                  onClick={onCreateProfile}
                  className="w-full h-14 bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Редактировать профиль
                </Button>
              </>
            )}
            
            {/* Settings button */}
            <Button
              onClick={onSettings}
              className="w-full h-14 bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <SettingsIcon className="w-5 h-5 mr-2" />
              Настройки
            </Button>

            {/* Create mock users */}
            <Button
              onClick={onCreateMockUsers}
              variant="ghost"
              className="w-full h-12 text-pink-200 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Создать тестовых пользователей
            </Button>
          </div>

          {/* Security info */}
          <div className="mt-8 pt-8 border-t border-white/20">
            <div className="text-center space-y-2">
              <p className="text-pink-100 text-sm">🔒 Защищено Zero-Trust архитектурой</p>
              <p className="text-pink-200/70 text-xs">Данные шифруются через Spoon OS</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <button 
            onClick={onSettings}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="text-2xl mb-2">🔐</div>
            <p className="text-white text-xs">Spoon OS</p>
          </button>
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer">
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-white text-xs">AI Matching</p>
          </div>
          <button
            onClick={onViewMatches}
            className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 text-center border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="text-2xl mb-2">💬</div>
            <p className="text-white text-xs">Приватный чат</p>
          </button>
        </div>
      </div>
    </div>
  );
}