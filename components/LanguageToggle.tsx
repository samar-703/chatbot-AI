'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { motion } from 'framer-motion';

function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={toggleLanguage}
        variant="outline"
        size="sm"
        className="bg-zinc-900/50 border-zinc-500 hover:border-purple-600 hover:bg-zinc-700/80 hover:text-white transition-all duration-300 shadow-lg opacity-100"
      >
        <Languages className="h-4 w-4 mr-2" />
        <span className="font-medium">{language === 'en' ? '日本語' : 'English'}</span>
      </Button>
    </motion.div>
  );
}

export default memo(LanguageToggle);
