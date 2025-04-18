'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowsRightLeftIcon,
  PauseIcon,
  PlayIcon,
  ArrowPathIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

import allWords from '../components/data/all.json';
import { WordEntry } from '../types/word';
import useTimer from '../hooks/useTimer';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const ALL_WORDS = allWords as WordEntry[];

export default function WordScreen() {
  const [level, setLevel] = useState<Level>('A1');
  const [minutes, setMinutes] = useState(5);
  const { secondsLeft, isRunning, start, pause, reset, format } = useTimer();
  const [showWelcome, setShowWelcome] = useState(true);
  const [, setExploded] = useState(false);

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
    if (isRunning) pause();
    else {
      if (secondsLeft === 0) {
        reset(minutes * 60);
      }
      start();
    }
  };

  const handleReset = () => {
    reset(minutes * 60);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-4 relative"
    >
      {showWelcome && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border border-green-400 rounded-lg p-6 shadow-xl z-50"
          dir="rtl"
        >
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-green-700">👋 مرحبًا</h2>
            <button
              onClick={() => {
                setShowWelcome(false);
                setExploded(true);
                setTimeout(() => setExploded(false), 500);
              }}
              className="text-green-500 hover:text-green-700"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-700 leading-relaxed text-right">
            لاستخدام الأداة، اختر مستوى اللغة الذي يناسبك، ثم اضغط على زر توليد الكلمة. بعد ذلك، قم بضبط المؤقت وابدأ بالتحدث عن الكلمة المحددة.
            <br />
            الهدف من هذه الأداة هو مساعدتك على التحدث بطلاقة عن مواضيع مختلفة خلال مدة زمنية محددة.
          </div>
         
          <div className="mt-4 text-sm text-gray-700 leading-relaxed text-right">
            للحصول على أفضل نتيجة:
          </div>
          <ul className="list-disc list-inside mt-1 text-sm text-gray-700 text-right" dir="rtl">
            <li>تحدث لمدة زمنية محددة، ثم دوِّن بعض الكلمات التي كان من الممكن أن تساعدك على التعبير بشكل أفضل.</li>
            <li>قم بضبط المؤقت من جديد، واستخدم هذه الكلمات في حديثك. ستلاحظ أنك تعبر عن أفكارك بثقة أكبر.</li>
          </ul>
        </motion.div>
      )}

      {!showWelcome && (
        <button
          onClick={() => setShowWelcome(true)}
          className="fixed bottom-4 right-4 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-3 shadow-lg z-40"
          title="إظهار التعليمات"
        >
          💡
        </button>
      )}

      {/* Level Selector */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            onClick={() => {
              setLevel(lvl);
              const next = ALL_WORDS.find((w) => w.level === lvl && w.type === 'noun');
              if (next) setCurrent(next);
            }}
            className={`px-4 py-2 rounded-full font-semibold border 
              ${
                level === lvl
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white text-green-700 border-green-400 hover:bg-green-100'
              }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Word Display */}
      <div className="w-full max-w-full px-4 text-center">
        <motion.h1
          key={current.lemma}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-green-800 font-extrabold truncate"
          style={{
            fontSize: 'min(10vw, 64px)',
            lineHeight: '1.2',
          }}
        >
          {current.lemma}
        </motion.h1>
      </div>

      {/* Translations */}
      <motion.p
        key={JSON.stringify(current.translations)}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
        className="mt-4 text-3xl text-gray-600 text-center"
      >
        {(current.translations?.en?.[0] ?? '—') + ' · ' + (current.translations?.fr?.[0] ?? '—')}
      </motion.p>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGenerate}
        className="mt-10 inline-flex items-center bg-green-600 hover:bg-green-700 
        text-white font-semibold px-8 py-4 rounded-full 
        focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <ArrowsRightLeftIcon className="h-6 w-6 mr-2" />
        Generate
      </motion.button>

      {/* Timer Frame */}
      <div className="mt-8 w-full max-w-md border-2 border-green-600 bg-white rounded-lg p-6 
        flex flex-col items-center shadow-lg"
      >
        {/* Minutes Stepper */}
        <div className="flex items-center space-x-2 mb-4">
          <label className="font-medium text-green-700">Minutes:</label>
          <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <button
              onClick={() => setMinutes((m) => Math.max(1, m - 1))}
              className="p-2 bg-green-50 hover:bg-green-100"
            >
              <MinusIcon className="h-5 w-5 text-green-700" />
            </button>
            <span className="px-4 text-green-800 font-medium">{minutes}</span>
            <button
              onClick={() => setMinutes((m) => Math.min(30, m + 1))}
              className="p-2 bg-green-50 hover:bg-green-100"
            >
              <PlusIcon className="h-5 w-5 text-green-700" />
            </button>
          </div>
        </div>

        {/* Play / Pause & Reset */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleToggle}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 
              text-white font-semibold rounded-full 
              focus:outline-none focus:ring-2 focus:ring-green-400 
              flex items-center"
          >
            {isRunning ? (
              <PauseIcon className="h-5 w-5 mr-1" />
            ) : (
              <PlayIcon className="h-5 w-5 mr-1" />
            )}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 
              text-gray-700 font-semibold rounded-full 
              focus:outline-none focus:ring-2 focus:ring-gray-400 
              flex items-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-1" />
            Reset
          </button>
        </div>

        {/* Countdown Display */}
        <div className="bg-green-100 text-green-800 font-mono text-2xl px-6 py-2 rounded-full">
          {format()}
        </div>
      </div>
    </motion.main>
  );
}
