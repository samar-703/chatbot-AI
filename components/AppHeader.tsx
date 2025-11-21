'use client';

import { memo } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/language-context';
import LanguageToggle from './LanguageToggle';

function AppHeader() {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-between w-full">
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
            {t.header.title}
          </h1>
          <p className="text-xs text-zinc-400">{t.header.subtitle}</p>
        </div>
      </motion.div>
      <LanguageToggle />
    </div>
  );
}

export default memo(AppHeader);
