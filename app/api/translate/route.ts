import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

const GOOGLE_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';

export async function POST(request: NextRequest) {
  let originalText = '';
  
  try {
    const body = await request.json();
    const { text, targetLanguage } = body;
    originalText = text; // Store for error fallback

   
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
    // Return original text as fallback instead of failing completely
    return NextResponse.json(
      { 
        error: 'Failed to translate',
        details: error instanceof Error ? error.message : 'Unknown error',
        translatedText: originalText // Return original text as fallback
      },
      { status: 200 } // Return 200 to prevent frontend errors
    );
  }
}
