import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '@/types';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, weatherData, conversationHistory } = body;

    // Validate input
    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured',
          message: 'Please add GEMINI_API_KEY to your .env.local file. Get your key from https://aistudio.google.com/app/apikey',
          mock: true,
          mockResponse: getMockResponse(message, weatherData)
        },
        { status: 200 }
      );
    }

    // Build the prompt with travel theme context
    const systemPrompt = buildTravelPrompt(weatherData);
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

    // ============================================
    // GEMINI API CALL
    // ============================================
    // Make request to Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: fullPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Extract the generated text from Gemini response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    const chatResponse: ChatResponse = {
      message: generatedText,
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

// ============================================
// Helper Functions
// ============================================

function buildTravelPrompt(weatherData?: any): string {
  let prompt = `You are a friendly and knowledgeable travel assistant AI. Your role is to help users plan trips, suggest destinations, recommend activities, and provide travel advice.

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

  prompt += `Always be helpful, friendly, and provide specific, actionable recommendations. Keep responses concise but informative.`;

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
