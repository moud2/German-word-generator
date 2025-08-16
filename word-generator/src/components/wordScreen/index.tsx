'use client';

import React from 'react';
import Footer from '../layout/Footer';
import Header from '../layout/Header';
import dynamic from 'next/dynamic';
const Recorder = dynamic(() => import('../recorder/Recorder'), { ssr: false });
import LevelSelector from './LevelSelector';
import WordDisplay from './WordDisplay';
import GenerateButton from './GenerateButton';

import '../../app/i18n';
import useWordScreen from '../../hooks/useWordScreen';

export default function WordScreen() {
  const {
    showWelcome,
    setShowWelcome,
    tips,
    features,
    level,
    setLevel,
    allWords,
    current,
    setCurrent,
    handleGenerate,
    i18n,
    t,
  } = useWordScreen();

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-[#f5f7fa] to-[#e8f0f8]">
      <Header />

      {/* Background with subtle dots */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
      />

      {/* Center content */}
      <main className="flex flex-1 items-center justify-center relative z-10 px-4 py-10">
        <div className="relative">
          {/* light halo */}
          <div className="pointer-events-none absolute w-[420px] h-[520px] -top-16 left-1/2 -translate-x-1/2 rounded-[32px] bg-[radial-gradient(80%_120%_at_50%_0%,rgba(255,255,255,.8),transparent_50%)] blur-xl opacity-60" />

          {/* OUTER LIGHT SHELL */}
          <div className="relative w-[400px] max-w-full rounded-[28px] p-3 ring-1 ring-white/60 bg-gradient-to-b from-blue-200/60 to-white/60 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,.6),0_20px_60px_rgba(0,0,0,.05)]">
            {/* INNER GLASS CARD */}
            <div className="relative rounded-[22px] bg-white/60 backdrop-blur-xl border border-gray-200 p-5 text-gray-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,.6),0_20px_50px_rgba(0,0,0,.05)]">
              {/* Level selector */}
              <LevelSelector
                level={level}
                setLevel={setLevel}
                allWords={allWords}
                setCurrent={setCurrent}
              />

              {/* Word + translations */}
              <WordDisplay word={current} i18n={i18n} />

              {/* Generate */}
              <GenerateButton onClick={handleGenerate} />

              {/* Recorder card */}
              <div className="mt-6">
                <Recorder />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
