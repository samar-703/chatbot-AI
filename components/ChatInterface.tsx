'use client';

import { useEffect, useRef, memo } from 'react';
import { Message } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from './MessageBubble';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
}

function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-full pr-4">
      <div ref={scrollRef} className="flex flex-col gap-6 p-4">
        {messages.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              旅行アシスタントへようこそ
            </h2>
            <p className="text-zinc-400 mb-1">
              Welcome to your Travel Assistant
            </p>
            <p className="text-sm text-zinc-500">
              音声入力ボタンを押して、日本語で話しかけてください
            </p>
          </motion.div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center py-4"
          >
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </motion.div>
        )}
      </div>
    </ScrollArea>
  );
}

export default memo(ChatInterface);
