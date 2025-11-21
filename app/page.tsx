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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [textInput, setTextInput] = useState('');

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
          alert('Failed to fetch weather data. Please try again.');
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
      alert('Geolocation is not supported by your browser');
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
          errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
        } else if (error.code === 2) {
          errorMessage = 'Location unavailable. Please try again.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please check your connection and try again.';
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
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoadingChat(true);

    try {
      let contextPrompt = content;
      if (weather) {
        contextPrompt += `\n\nCurrent weather in ${weather.location}: ${weather.temperature}°C, ${weather.condition}.`;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: contextPrompt }),
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingChat(false);
      setTextInput('');
    }
  };

  // Handle voice transcript
  const handleVoiceTranscript = (transcript: string) => {
    sendMessage(transcript);
  };

  // Handle text input submit
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(textInput);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <AppHeader />

            {/* Weather Search */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2"
            >
              <Input
                placeholder="City Name / 都市名 (e.g., Tokyo)"
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Chat Area */}
          <Card className="lg:col-span-2 flex flex-col overflow-hidden shadow-2xl border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <div className="flex-1 overflow-hidden">
              <ChatInterface messages={messages} isLoading={isLoadingChat} />
            </div>

            {/* Input Area */}
            <div className="border-t border-zinc-800 p-4 bg-black/20">
              <form onSubmit={handleTextSubmit} className="flex gap-2 items-center">
                <Input
                  placeholder="Type your message here... / メッセージを入力..."
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
              <h3 className="font-semibold flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5 text-purple-500" />
                How to Use / 使い方
              </h3>
              <ul className="text-sm space-y-2 text-zinc-400">
                <li> ⏹️Speak in Japanese/English via Voice Input</li>
                <li> ⏹️Type text to chat</li>
                <li> ⏹️Get weather & travel tips</li>
                <li> ⏹️Plan your trip with AI</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
