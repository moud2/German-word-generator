'use client';

import { motion } from 'framer-motion';
import { WordEntry } from '../../types/word';

interface WordDisplayProps {
  word: WordEntry;
  i18n: any;
}

export default function WordDisplay({ word, i18n }: WordDisplayProps) {
  const getArticle = (gender?: 'm' | 'f' | 'n') => {
    if (!gender) return '';
    if (gender === 'm') return 'der';
    if (gender === 'f') return 'die';
    return 'das';
  };

  return (
    <div className="w-full max-w-full px-4 text-center flex flex-col items-center gap-2">
      {/* German Word */}
      <motion.h1
        key={word.lemma}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-green-800 font-extrabold truncate text-4xl md:text-6xl"
      >
        {word.type === 'noun' && word.gender
          ? `${getArticle(word.gender)} ${word.lemma}`
          : word.lemma}
      </motion.h1>

      {/* Translations */}
      <motion.p
        key={JSON.stringify(word.translations)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
        className="text-2xl text-gray-600"
      >
        {(word.translations?.en?.[0] ?? '—') + ' · ' + (word.translations?.fr?.[0] ?? '—')}
      </motion.p>
    </div>
  );
}
