import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, targetLanguage } = body;

    // Validate input
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Gemini API key not configured',
          translatedText: text // Return original text if no API key
        },
        { status: 200 }
      );
    }

    const languageName = targetLanguage === 'ja' ? 'Japanese' : 'English';
    const prompt = `Translate the following text to ${languageName}. Only provide the translation, no explanations or additional text:\n\n${text}`;

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
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text;

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
