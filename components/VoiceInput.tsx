'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { VoiceRecognitionResult } from '@/types';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

export default function VoiceInput({ onTranscript, disabled }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
  const accumulatedTranscriptRef = useRef<string>(''); // Store accumulated transcript

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      // ============================================
      // JAPANESE VOICE RECOGNITION SETUP
      // ============================================
      // Initialize Speech Recognition with Japanese language
      const recognition = new SpeechRecognition();
      recognition.lang = 'ja-JP'; 
      recognition.continuous = true; // Allow continuous listening without auto-stop
      recognition.interimResults = true; // Show real-time transcription
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        accumulatedTranscriptRef.current = ''; // Reset accumulated transcript
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        // Accumulate all final results
        for (let i = 0; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart;
          } else {
            interimTranscript += transcriptPart;
          }
        }
      
        // Store the accumulated final transcript
        accumulatedTranscriptRef.current = finalTranscript;
        
        // Show the accumulated transcript in real-time (final + interim)
        const displayTranscript = finalTranscript + interimTranscript;
        setTranscript(displayTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          alert('マイクへのアクセスが拒否されました。ブラウザの設定でマイクを許可してください。\n(Microphone access denied. Please allow microphone access in your browser settings.)');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Send the final accumulated transcript when recording stops
        if (accumulatedTranscriptRef.current) {
          onTranscript(accumulatedTranscriptRef.current);
          accumulatedTranscriptRef.current = ''; // Clear after sending
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-muted-foreground text-center p-4">
        音声入力はこのブラウザではサポートされていません。
        <br />
        Chrome、Edge、またはSafariをお使いください。
        <br />
        <span className="text-xs">
          (Voice input is not supported in this browser. Please use Chrome, Edge, or Safari.)
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={toggleListening}
        disabled={disabled}
        size="lg"
        variant={isListening ? 'destructive' : 'default'}
        className={`relative transition-all duration-300 ${
          isListening ? 'scale-110 shadow-lg' : ''
        }`}
      >
        {isListening ? (
          <MicOff className="h-5 w-5 animate-pulse" />
        ) : (
          <Mic className="h-5 w-5" />
        )}
      </Button>

      {/* Floating Transcript/Status */}
      <div className="absolute bottom-full mb-4 right-0 z-50 w-max max-w-[300px] flex flex-col items-end gap-2 pointer-events-none">
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-white bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-white/10 animate-pulse">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Listening...</span>
          </div>
        )}

        {transcript && (
          <div className="text-sm p-3 bg-white text-black rounded-xl shadow-xl border border-zinc-200 animate-in slide-in-from-bottom-2 fade-in duration-200">
            <span className="font-semibold text-purple-600 mr-1">Recognizing:</span>
            {transcript}
          </div>
        )}
      </div>
    </div>
  );
}
