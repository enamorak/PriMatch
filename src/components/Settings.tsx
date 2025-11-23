import { ArrowLeft, Shield, Trash2, RotateCcw, Lock, Zap, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useState, useEffect } from 'react';
import { spoonOS } from '../services/spoonos';

interface SettingsProps {
  encryptionEnabled: boolean;
  onEncryptionToggle: (enabled: boolean) => void;
  onBack: () => void;
  onClearMatches: () => void;
  onResetSwipes: () => void;
}

export function Settings({ 
  encryptionEnabled, 
  onEncryptionToggle, 
  onBack,
  onClearMatches,
  onResetSwipes
}: SettingsProps) {
  const [spoonOSStatus, setSpoonOSStatus] = useState({ available: false, provider: 'Loading...' });

  useEffect(() => {
    const status = spoonOS.getStatus();
    setSpoonOSStatus(status);
  }, []);

  const handleClearMatches = () => {
    if (confirm('Вы уверены, что хотите удалить все мэтчи?')) {
      onClearMatches();
      alert('✅ Все мэтчи удалены');
    }
  };

  const handleResetSwipes = () => {
    if (confirm('Сбросить историю свайпов и начать заново?')) {
      onResetSwipes();
      alert('✅ История свайпов сброшена');
    }
  };

  return (
    <div className="min-h-screen p-4 py-8">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-3xl text-white">Настройки</h1>
        </div>

        {/* Spoon OS Status */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-fuchsia-300" />
            <h2 className="text-xl text-white">Статус Spoon OS</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${spoonOSStatus.available ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
                <div>
                  <p className="text-white">Провайдер шифрования</p>
                  <p className="text-pink-200 text-sm">{spoonOSStatus.provider}</p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20">
              <p className="text-pink-100 text-sm">
                🔐 <span className="text-white">Zero-Trust архитектура:</span> Все персональные данные шифруются через Spoon OS Enclaves перед сохранением. Данные хранятся в зашифрованном виде и дешифруются только при необходимости.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-6 h-6 text-fuchsia-300" />
            <h2 className="text-xl text-white">Конфиденциальность</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex-1">
                <Label htmlFor="encryption" className="text-white cursor-pointer">
                  Шифрование Spoon OS
                </Label>
                <p className="text-pink-200 text-sm mt-1">
                  Использовать защищенные анклавы для шифрования
                </p>
              </div>
              <Switch
                id="encryption"
                checked={encryptionEnabled}
                onCheckedChange={onEncryptionToggle}
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex-1">
                <Label className="text-white cursor-pointer">
                  Конфиденциальные вычисления
                </Label>
                <p className="text-pink-200 text-sm mt-1">
                  AI matching в защищенной среде
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <div className="flex-1">
                <Label className="text-white cursor-pointer">
                  End-to-End шифрование чата
                </Label>
                <p className="text-pink-200 text-sm mt-1">
                  Сообщения защищены E2EE
                </p>
              </div>
              <Switch checked={true} disabled />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-fuchsia-300" />
            <h2 className="text-xl text-white">Управление данными</h2>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleResetSwipes}
              variant="outline"
              className="w-full justify-start h-auto p-4 border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5 mr-3 text-fuchsia-300" />
              <div className="text-left flex-1">
                <p>Сбросить историю свайпов</p>
                <p className="text-sm text-pink-200">Начать свайпинг заново</p>
              </div>
            </Button>

            <Button
              onClick={handleClearMatches}
              variant="outline"
              className="w-full justify-start h-auto p-4 border-white/20 text-white hover:bg-white/10 hover:border-red-500/30"
            >
              <Trash2 className="w-5 h-5 mr-3 text-red-400" />
              <div className="text-left flex-1">
                <p>Удалить все мэтчи</p>
                <p className="text-sm text-pink-200">Очистить список совпадений</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h2 className="text-xl text-white mb-4">О PriMatch</h2>
          <div className="space-y-3 text-sm text-pink-200">
            <p>
              <span className="text-white">Версия:</span> MVP 1.0.0
            </p>
            <p>
              <span className="text-white">Архитектура:</span> Zero-Trust Data Storage
            </p>
            <p>
              <span className="text-white">Технологии:</span> React, Tailwind CSS, Spoon OS
            </p>
            <div className="pt-4 border-t border-white/20">
              <p className="text-xs text-pink-300">
                ⚠️ Это демонстрационное приложение. Не используйте для хранения реальных персональных данных.
              </p>
            </div>
          </div>
        </div>

        {/* API Key Info */}
        <div className="mt-6 backdrop-blur-xl bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 rounded-2xl p-4 border border-fuchsia-500/20">
          <p className="text-pink-100 text-xs text-center">
            🔑 Spoon OS API подключен и готов к использованию
          </p>
        </div>
      </div>
    </div>
  );
}
