import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage } = body;

   
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    
    if (!GOOGLE_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Google API key not configured',
          translatedText: text 
        },
        { status: 200 }
      );
    }

    const languageName = targetLanguage === 'ja' ? 'Japanese' : 'English';
    const prompt = `Translate the following text to ${languageName}. Only provide the translation, no explanations or additional text:\n\n${text}`;

    
    const { text: translatedText } = await generateText({
      model: google('gemini-2.0-flash-exp'),
      prompt: prompt,
    });

    return NextResponse.json({ translatedText: translatedText.trim() });
  } catch (error) {
    console.error('Translation API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to translate',
        details: error instanceof Error ? error.message : 'Unknown error',
        translatedText: '' // Return empty on error
      },
      { status: 500 }
    );
  }
}
