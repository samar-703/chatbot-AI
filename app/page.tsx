'use client';

import { useState, useEffect } from 'react';
import { Message, WeatherData } from '@/types';
import ChatInterface from '@/components/ChatInterface';
import VoiceInput from '@/components/VoiceInput';
import AppHeader from '@/components/AppHeader';
import WeatherCard from '@/components/WeatherCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Sparkles, Mic, MicOff, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';

export default function Home() {
  const { t, language, onLanguageChange } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  
  const translateMessage = async (message: Message, targetLang: string): Promise<Message> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: message.originalContent || message.content, 
          targetLanguage: targetLang 
        }),
      });
      
      const data = await response.json();
      
      if (data.translatedText) {
        return {
          ...message,
          content: data.translatedText,
          originalContent: message.originalContent || message.content,
          translatedContent: data.translatedText,
        };
      }
      return message;
    } catch (error) {
      console.error('Translation error:', error);
      return message;
    }
  };

  
  useEffect(() => {
    const unsubscribe = onLanguageChange(async (newLang) => {
      if (messages.length === 0) return;
      
      setIsTranslating(true);
      try {
        const translatedMessages = await Promise.all(
          messages.map(msg => translateMessage(msg, newLang))
        );
        setMessages(translatedMessages);
      } catch (error) {
        console.error('Failed to translate messages:', error);
      } finally {
        setIsTranslating(false);
      }
    });

    return unsubscribe;
  }, [messages, onLanguageChange]);

  // Fetch weather data
  const fetchWeather = async (query: string | { lat: number; lon: number }) => {
    setIsLoadingWeather(true);
    try {
      let url = '/api/weather?';
      if (typeof query === 'string') {
        if (!query.trim()) return;
        url += `city=${encodeURIComponent(query)}`;
      } else {
        url += `lat=${query.lat}&lon=${query.lon}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        console.error('Weather API error:', data.error);
        if (data.mock && data.data) {
          setWeather(data.data);
          if (typeof query !== 'string' && data.data.location) {
            setCityInput(data.data.location);
          }
        } else {
          alert(t.errors.weatherFailed);
        }
      } else {
        setWeather(data);
        if (typeof query !== 'string' && data.location) {
          setCityInput(data.location);
        }
      }
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      alert('An error occurred while fetching weather data.');
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const handleLocationClick = () => {
    if (!('geolocation' in navigator)) {
      alert(t.errors.geolocationNotSupported);
      return;
    }

    setIsLoadingWeather(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Location error details:', {
          code: error.code,
          message: error.message,
        });
        setIsLoadingWeather(false);
        let errorMessage = 'Failed to get location.';
        if (error.code === 1) {
          errorMessage = t.errors.locationDenied;
        } else if (error.code === 2) {
          errorMessage = t.errors.locationUnavailable;
        } else if (error.code === 3) {
          errorMessage = t.errors.locationTimeout;
        }
        alert(errorMessage);
      },
      { 
        timeout: 30000,
        maximumAge: Infinity,
        enableHighAccuracy: false
      }
    );
  };

  // Sending message to AI
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      originalContent: content,
      timestamp: new Date(),
    };

    
    setMessages((prev) => [...prev, newMessage]);
    setIsLoadingChat(true);

    
    if (language === 'ja' && !/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(content)) {
       translateMessage(newMessage, language).then(translatedMsg => {
         setMessages(prev => prev.map(msg => msg.id === newMessage.id ? translatedMsg : msg));
       });
    } else if (language === 'en' && /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/.test(content)) {
       translateMessage(newMessage, language).then(translatedMsg => {
         setMessages(prev => prev.map(msg => msg.id === newMessage.id ? translatedMsg : msg));
       });
    }

    try {
      let contextPrompt = content;
      if (weather) {
        contextPrompt += `\n\nCurrent weather in ${weather.location}: ${weather.temperature}°C, ${weather.condition}.`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: contextPrompt,
          language // Pass current language to backend
        }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        originalContent: data.message,
        translatedContent: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t.chat.errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
      setTextInput('');
    }
  };


  const handleVoiceTranscript = (transcript: string) => {
    sendMessage(transcript);
  };

  
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(textInput);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <AppHeader />

          {/* Weather Search */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2 mt-4"
          >
            <Input
              placeholder={t.weather.placeholder}
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather(cityInput)}
              className="w-64 bg-zinc-900/50 border-zinc-800 focus:border-purple-500 text-white placeholder:text-zinc-500"
            />

            <Button
              type="button"
              onClick={handleLocationClick}
              disabled={isLoadingWeather}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/20"
              size="icon"
            >
              {isLoadingWeather ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden shadow-2xl border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex-1 overflow-hidden">
              <ChatInterface messages={messages} isLoading={isLoadingChat || isTranslating} />
            </div>

            {/* Input Area */}
            <div className="border-t border-zinc-800 p-4 bg-black/20">
              <form onSubmit={handleTextSubmit} className="flex gap-2 items-center">
                <Input
                  placeholder={t.chat.inputPlaceholder}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  disabled={isLoadingChat}
                  className="flex-1 bg-zinc-900/50 border-zinc-800 focus:border-purple-500 text-white placeholder:text-zinc-500"
                />
                <Button 
                  type="submit" 
                  disabled={isLoadingChat || !textInput.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 text-white shadow-lg shadow-purple-500/20 transition-all duration-300 px-6"
                >
                  {isLoadingChat ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
                <VoiceInput
                  onTranscript={handleVoiceTranscript}
                  disabled={isLoadingChat}
                />
              </form>
            </div>

          </Card>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {weather && <WeatherCard key={weather.location} weather={weather} />}

            <Card className="p-6 bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
              <h3 className="font-semibold flex items-center gap-2 text-white mb-3">
                <Sparkles className="h-5 w-5 text-purple-500" />
                {t.howToUse.title}
              </h3>
              <ul className="text-sm space-y-2 text-zinc-400">
                {t.howToUse.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
