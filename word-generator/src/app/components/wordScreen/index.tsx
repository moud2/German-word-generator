'use client';

import Footer from '../Footer';
import Header from '../Header';
import dynamic from 'next/dynamic';
const Recorder = dynamic(() => import('../recorder/Recorder'), { ssr: false });


import WelcomeModal from './WelcomeModal';
import InstructionToggle from './InstructionToggle';
import LevelSelector from './LevelSelector';
import WordDisplay from './WordDisplay';
import GenerateButton from './GenerateButton';
import TimerPanel from './TimerPanel';
import ComingSoonBox from './ComingSoonBox';
import '../../i18n';

import useWordScreen from './useWordScreen';

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
    <div className="flex flex-col min-h-screen bg-green-50">
      <Header />

      <main className="flex-grow flex flex-col items-center px-4 pt-24 sm:pt-28 pb-8 space-y-6 sm:space-y-8 md:space-y-10">
        {showWelcome && (
          <WelcomeModal
            showWelcome={showWelcome}
            setShowWelcome={setShowWelcome}
            i18n={i18n}
            tips={tips}
            t={t}
          />
        )}

        {!showWelcome && <InstructionToggle onClick={() => setShowWelcome(true)} />}

        <LevelSelector
          level={level}
          setLevel={setLevel}
          allWords={allWords}
          setCurrent={setCurrent}
        />

        {/* Word and Generate button closer together */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <WordDisplay word={current} i18n={i18n} />
          <GenerateButton onClick={handleGenerate} />
        </div>

        {/* Timer Panel */}
        <div className="w-full max-w-md mt-4 sm:mt-5 md:mt-6">
          <TimerPanel
            minutes={minutes}
            setMinutes={setMinutes}
            isRunning={isRunning}
            handleToggle={handleToggle}
            handleReset={handleReset}
            format={format}
          />
        </div>

        {/* Voice Recorder */}
        <div className="w-full max-w-md mt-4 sm:mt-5 md:mt-6">
          <Recorder />
        </div>

        {/* Coming Soon */}
        <ComingSoonBox features={features} t={t} />
      </main>

      <Footer />
    </div>
  );
}
