import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Image as ImageIcon, Smile, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { spoonOS } from '../services/spoonos';

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

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: Date;
  encrypted?: boolean;
}

interface ChatProps {
  match: Match;
  currentUserId: number;
  currentUserName: string;
  onBack: () => void;
}

export function Chat({ match, currentUserId, currentUserName, onBack }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: match.user.id,
      text: 'Привет! Рад нашему совпадению! 😊',
      timestamp: new Date(Date.now() - 3600000),
      encrypted: true
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [encryptionActive, setEncryptionActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      let messageText = newMessage;
      let encrypted = false;

      // Encrypt message using Spoon OS
      if (encryptionActive) {
        const result = await spoonOS.encryptInEnclave(newMessage);
        if (result.success) {
          encrypted = true;
          console.log('✅ Message encrypted via Spoon OS');
        }
      }

      const message: Message = {
        id: messages.length + 1,
        senderId: currentUserId,
        text: messageText,
        timestamp: new Date(),
        encrypted
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate response
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const responses = [
            'Интересно! Расскажи подробнее',
            'Звучит здорово! 😊',
            'Давай встретимся как-нибудь?',
            'Я тоже так думаю!',
            'Хаха, согласен! 😄'
          ];
          const response: Message = {
            id: messages.length + 2,
            senderId: match.user.id,
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            encrypted: true
          };
          setMessages(prev => [...prev, response]);
          setIsTyping(false);
        }, 2000);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Сегодня';
    }
    
    return messageDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          
          <div 
            className="flex items-center gap-3 flex-1 cursor-pointer hover:bg-white/10 p-2 rounded-xl transition-all"
            onClick={() => alert(`Профиль ${match.user.name}`)}
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                <img
                  src={match.user.photoUrl}
                  alt={match.user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white/20"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-white">{match.user.name}</h2>
              <p className="text-pink-200 text-sm flex items-center gap-1">
                {isTyping ? (
                  <>
                    <span className="animate-pulse">печатает</span>
                    <span className="flex gap-1">
                      <span className="w-1 h-1 bg-pink-300 rounded-full animate-bounce"></span>
                      <span className="w-1 h-1 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-1 h-1 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </span>
                  </>
                ) : (
                  'Онлайн'
                )}
              </p>
            </div>
            {match.compatibilityScore && (
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 text-white px-3 py-1 rounded-full text-xs">
                {match.compatibilityScore}% совместимость
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={() => alert('Меню чата')}
          >
            <MoreVertical className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Match notification */}
          <div className="text-center py-4">
            <div className="inline-block backdrop-blur-xl bg-white/10 rounded-full px-6 py-3 border border-white/20">
              <p className="text-pink-200 text-sm">
                ✨ Вы понравились друг другу {formatDate(match.matchedAt)}
              </p>
            </div>
          </div>

          {/* Messages */}
          {messages.map((message) => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className={`max-w-[70%] ${isOwn ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`rounded-3xl px-6 py-3 ${
                      isOwn
                        ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white'
                        : 'backdrop-blur-xl bg-white/20 text-white border border-white/20'
                    } hover:shadow-lg transition-shadow cursor-pointer`}
                    onClick={() => {
                      if (message.encrypted) {
                        alert('🔐 Сообщение зашифровано через Spoon OS');
                      }
                    }}
                  >
                    <p className="break-words">{message.text}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <p className="text-xs text-pink-200">{formatTime(message.timestamp)}</p>
                    {message.encrypted && (
                      <span className="text-xs">🔒</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="backdrop-blur-xl bg-white/20 text-white border border-white/20 rounded-3xl px-6 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="backdrop-blur-xl bg-white/10 border-t border-white/20 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => alert('Прикрепить изображение')}
            >
              <ImageIcon className="w-5 h-5" />
            </Button>
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => alert('Выбрать эмодзи')}
            >
              <Smile className="w-5 h-5" />
            </Button>

            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Напишите сообщение..."
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus:bg-white/30 flex-1"
            />
            <Button
              type="submit"
              size="icon"
              className="w-12 h-12 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white shadow-lg hover:scale-110 transition-all"
              disabled={!newMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
          
          {/* Encryption notice */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setEncryptionActive(!encryptionActive)}
              className="text-pink-200 text-xs hover:text-white transition-colors"
            >
              {encryptionActive ? '🔐 Шифрование активно' : '⚠️ Шифрование отключено'}
            </button>
            <span className="text-pink-300 text-xs">• Spoon OS Enclave</span>
          </div>
        </div>
      </div>
    </div>
  );
}