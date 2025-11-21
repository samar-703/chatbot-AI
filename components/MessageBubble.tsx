'use client';

import { Message } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <Avatar className={`h-10 w-10 ${isUser ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
        <AvatarFallback className="text-white">
          {isUser ? <User className="h-5 w-5" /> : <Plane className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col gap-1 max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
              : 'bg-zinc-800 border border-zinc-700 text-zinc-100'
          }`}
        >
          <div className="text-sm leading-relaxed prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground px-2">
          {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  );
}
