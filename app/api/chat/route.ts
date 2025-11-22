import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '@/types';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, weatherData, conversationHistory, language } = body;

    // Validate input
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Google API key not configured',
          message: 'Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env.local file. Get your key from https://aistudio.google.com/app/apikey',
          mock: true,
          mockResponse: getMockResponse(message, weatherData)
        },
        { status: 200 }
      );
    }

    
    const systemPrompt = buildTravelPrompt(weatherData, language);

   
    const { text } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      system: systemPrompt,
      prompt: message,
    });

    const chatResponse: ChatResponse = {
      message: text,
    };

    return NextResponse.json(chatResponse);
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}


function buildTravelPrompt(weatherData?: any, language: string = 'en'): string {
  const langName = language === 'ja' ? 'Japanese' : 'English';
  
  let prompt = `You are a friendly and knowledgeable travel assistant AI. Your role is to help users plan trips, suggest destinations, recommend activities, and provide travel advice.

IMPORTANT: You must ALWAYS respond in ${langName}, regardless of the language the user speaks. Even if the user speaks a different language, your response MUST be in ${langName}.

Key responsibilities:
- Suggest travel destinations based on user preferences
- Recommend activities, restaurants, and attractions
- Provide practical travel tips and advice
- Consider weather conditions when making suggestions
- Be enthusiastic and inspiring about travel

`;

  if (weatherData) {
    prompt += `Current weather information:
- Location: ${weatherData.location}
- Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
- Condition: ${weatherData.description}
- Humidity: ${weatherData.humidity}%
- Wind Speed: ${weatherData.windSpeed} m/s

Use this weather information to provide relevant travel suggestions.

`;
  }

  prompt += `Always be helpful, friendly, and provide specific, actionable recommendations. Keep responses concise but informative. Remember to respond ONLY in ${langName}.`;

  return prompt;
}

function getMockResponse(message: string, weatherData?: any): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('weather') || lowerMessage.includes('天気')) {
    if (weatherData) {
      return `Based on the current weather in ${weatherData.location} (${weatherData.temperature}°C, ${weatherData.description}), I'd recommend some great travel activities! The conditions are perfect for exploring outdoor attractions. Would you like suggestions for specific activities or destinations?`;
    }
    return "I'd be happy to help with weather-based travel recommendations! Please allow me to check the current weather first.";
  }
  
  if (lowerMessage.includes('travel') || lowerMessage.includes('trip') || lowerMessage.includes('旅行')) {
    return "I'd love to help you plan your trip! Japan has amazing destinations like Tokyo, Kyoto, Osaka, and Hokkaido. Each offers unique experiences - from modern cityscapes to traditional temples, delicious cuisine to natural hot springs. What kind of experience are you looking for?";
  }
  
  if (lowerMessage.includes('food') || lowerMessage.includes('restaurant') || lowerMessage.includes('食べ物')) {
    return "Japan has incredible food! I recommend trying authentic ramen, sushi, tempura, and okonomiyaki. For a unique experience, visit Tsukiji Outer Market in Tokyo or explore the street food in Osaka's Dotonbori district. What type of cuisine interests you most?";
  }
  
  return "I'm here to help you plan an amazing trip! I can suggest destinations, activities, restaurants, and provide travel tips. What would you like to know about?";
}
