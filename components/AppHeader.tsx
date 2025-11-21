'use client';

import { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function AppHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3"
    >
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Chatbot
        </h1>
        <p className="text-xs text-zinc-400">AI Chatbot / 旅行アシスタント </p>
      </div>
    </motion.div>
  );
}

export default memo(AppHeader);
