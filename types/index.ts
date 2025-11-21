// TypeScript interfaces for the Travel Chatbot

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  weatherData?: WeatherData;
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
}

export interface ChatRequest {
  message: string;
  weatherData?: WeatherData;
  conversationHistory?: Message[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}

export interface WeatherRequest {
  city?: string;
  lat?: number;
  lon?: number;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}
