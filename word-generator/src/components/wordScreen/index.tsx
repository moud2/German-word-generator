'use client';

import Footer from '../layout/Footer';
import Header from '../layout/Header';
import dynamic from 'next/dynamic';
const Recorder = dynamic(() => import('../recorder/Recorder'), { ssr: false });

import WelcomeModal from './WelcomeModal';
import InstructionToggle from './InstructionToggle';
import LevelSelector from './LevelSelector';
import WordDisplay from './WordDisplay';
import GenerateButton from './GenerateButton';
import TimerPanel from './TimerPanel';
import ComingSoonBox from './ComingSoonBox';
import '../../app/i18n';

import useWordScreen from '../../hooks/useWordScreen';
import styles from './WordScreen.module.css'; // ✅ Import CSS module

export default function WordScreen() {
  const {
    showWelcome,
    setShowWelcome,
    tips,
    features,
    level,
    setLevel,
    allWords,
    minutes,
    setMinutes,
    isRunning,
    start,
    format,
    current,
    setCurrent,
    handleGenerate,
    handleToggle,
    handleReset,
    i18n,
    t,
  } = useWordScreen();

  return (
    <div className={styles.wrapper}> {/* ✅ Cleaner background */}
      <Header />

      <main className="flex-grow flex flex-col items-center px-4 pt-24 sm:pt-28 pb-8 relative z-10">
        
        {/* Glassy Card */}
        <section className={`${styles.card} rounded-3xl p-6 sm:p-8 border border-white/30 shadow-xl bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/50 dark:bg-white/10 dark:border-white/20`}>

          <div className="flex justify-center">
            <LevelSelector
              level={level}
              setLevel={setLevel}
              allWords={allWords}
              setCurrent={setCurrent}
            />
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <WordDisplay word={current} i18n={i18n} />
            <GenerateButton onClick={handleGenerate} />
          </div>

          <div className="mt-8">
            <Recorder />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
