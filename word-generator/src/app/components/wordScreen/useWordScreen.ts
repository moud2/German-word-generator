'use client';

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useTimer from '../../hooks/useTimer';
import allWords from '../../components/data/all.json';
import { WordEntry } from '../../types/word';
import dynamic from 'next/dynamic';
const Recorder = dynamic(() => import('../recorder/Recorder'), { ssr: false });




type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const ALL_WORDS = allWords as WordEntry[];

export default function useWordScreen() {
  const {
    secondsLeft,
    isRunning,
    start,        // ✅ Correctly extracted here
    pause,
    reset,
    format,
  } = useTimer();

  const { t, i18n } = useTranslation();

  const [level, setLevel] = useState<Level>('A1');
  const [minutes, setMinutes] = useState(5);
  const [showWelcome, setShowWelcome] = useState(true);
  const [, setExploded] = useState(false);

  const tips = t('welcome.tips', { returnObjects: true }) as string[];
  const features = t('welcome.coming_soon_items', { returnObjects: true }) as string[];

  const filteredWords = useMemo(
    () => ALL_WORDS.filter((word) => word.level === level && word.type === 'noun'),
    [level]
  );

  const [current, setCurrent] = useState<WordEntry>(filteredWords[0]);

  const handleGenerate = () => {
    const random = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setCurrent(random);
  };

  const handleToggle = () => {
    if (isRunning) {
      pause();
    } else {
      if (secondsLeft === 0) {
        reset(minutes * 60);
      }
      start(); // ✅ This will now work correctly
    }
  };

  const handleReset = () => {
    reset(minutes * 60);
  };

  return {
    level,
    setLevel,
    minutes,
    setMinutes,
    showWelcome,
    setShowWelcome,
    current,
    setCurrent,
    handleGenerate,
    handleToggle,
    handleReset,
    isRunning,
    format,
    t,
    i18n,
    tips,
    features,
    allWords: ALL_WORDS,
    start, // ✅ included in return for use elsewhere if needed
  };
}
