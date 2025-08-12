'use client';

import { motion } from 'framer-motion';
import { WordEntry } from '../../types/word';

interface WordDisplayProps {
  word: WordEntry;
  i18n: any; // kept for compatibility
}

export default function WordDisplay({ word }: WordDisplayProps) {
  const getArticle = (gender?: 'm' | 'f' | 'n') =>
    gender === 'm' ? 'der' : gender === 'f' ? 'die' : gender === 'n' ? 'das' : '';

  const title =
    word.type === 'noun' && word.gender
      ? `${getArticle(word.gender)} ${word.lemma}`
      : word.lemma;

  const en = word.translations?.en?.[0] ?? '—';
  const fr = word.translations?.fr?.[0] ?? '—';

  return (
    <div className="text-center mb-6">
      <motion.h1
        key={word.lemma}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-4xl font-extrabold tracking-tight"
      >
        {title}
      </motion.h1>

      <motion.p
        key={`${en}-${fr}`}
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05, type: 'spring', stiffness: 300, damping: 20 }}
        className="mt-2 text-sm text-gray-600"
      >
        {en} · {fr}
      </motion.p>
    </div>
  );
}
