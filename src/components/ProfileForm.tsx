import { useState } from 'react';
import { ArrowLeft, Upload, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface User {
  id?: number;
  name: string;
  age: number;
  bio: string;
  photoUrl: string;
  interests?: string[];
}

interface ProfileFormProps {
  existingProfile?: User | null;
  onSubmit: (profile: Omit<User, 'id'>) => void;
  onBack: () => void;
}

export function ProfileForm({ existingProfile, onSubmit, onBack }: ProfileFormProps) {
  const [name, setName] = useState(existingProfile?.name || '');
  const [age, setAge] = useState(existingProfile?.age?.toString() || '');
  const [bio, setBio] = useState(existingProfile?.bio || '');
  const [photoUrl, setPhotoUrl] = useState(existingProfile?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800');
  const [minAge, setMinAge] = useState('18');
  const [maxAge, setMaxAge] = useState('35');
  const [interests, setInterests] = useState<string[]>(existingProfile?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age && bio) {
      onSubmit({
        name,
        age: parseInt(age),
        bio,
        photoUrl,
        interests
      });
    }
  };

  const addInterest = () => {
    if (newInterest.trim() && !interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const suggestedInterests = ['путешествия', 'спорт', 'музыка', 'кино', 'кулинария', 'книги', 'искусство', 'фотография'];

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
          <h1 className="text-3xl text-white">
            {existingProfile ? 'Редактировать профиль' : 'Создать профиль'}
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile info card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-xl text-white mb-6">Основная информация</h2>
            
            <div className="space-y-6">
              {/* Photo preview */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                    <img
                      src={photoUrl}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="w-full">
                  <Label htmlFor="photoUrl" className="text-white mb-2 block">
                    URL фотографии
                  </Label>
                  <Input
                    id="photoUrl"
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">
                  Имя *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30"
                  placeholder="Ваше имя"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age" className="text-white mb-2 block">
                  Возраст *
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30"
                  placeholder="25"
                  min="18"
                  max="100"
                  required
                />
              </div>

              {/* Bio */}
              <div>
                <Label htmlFor="bio" className="text-white mb-2 block">
                  О себе *
                </Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 min-h-[120px]"
                  placeholder="Расскажите о себе, своих интересах и что вы ищете..."
                  required
                />
              </div>

              {/* Interests */}
              <div>
                <Label className="text-white mb-2 block">
                  Интересы
                </Label>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30"
                    placeholder="Добавить интерес"
                  />
                  <Button
                    type="button"
                    onClick={addInterest}
                    className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white"
                  >
                    Добавить
                  </Button>
                </div>
                
                {/* Current interests */}
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {interests.map((interest) => (
                      <Badge
                        key={interest}
                        className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white cursor-pointer hover:opacity-80"
                        onClick={() => removeInterest(interest)}
                      >
                        {interest} ✕
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Suggested interests */}
                <div className="flex flex-wrap gap-2">
                  {suggestedInterests
                    .filter(si => !interests.includes(si))
                    .map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="border-white/30 text-white cursor-pointer hover:bg-white/20"
                        onClick={() => setInterests([...interests, interest])}
                      >
                        + {interest}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl">
            <h2 className="text-xl text-white mb-6">Предпочтения в поиске</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minAge" className="text-white mb-2 block">
                    Минимальный возраст
                  </Label>
                  <Input
                    id="minAge"
                    type="number"
                    value={minAge}
                    onChange={(e) => setMinAge(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30"
                    min="18"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="maxAge" className="text-white mb-2 block">
                    Максимальный возраст
                  </Label>
                  <Input
                    id="maxAge"
                    type="number"
                    value={maxAge}
                    onChange={(e) => setMaxAge(e.target.value)}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30"
                    min="18"
                    max="100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-14 bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            {existingProfile ? 'Сохранить изменения' : 'Создать профиль'}
          </Button>

          {/* Security notice */}
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-4 border border-white/20">
            <p className="text-pink-100 text-sm text-center">
              🔒 Данные шифруются через Spoon OS перед сохранением
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}