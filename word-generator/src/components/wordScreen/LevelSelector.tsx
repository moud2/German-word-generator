'use client';

import { useRef, KeyboardEvent } from 'react';
import { WordEntry } from '../../types/word';

type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

interface LevelSelectorProps {
  level: Level;
  setLevel: (level: Level) => void;
  allWords: WordEntry[];
  setCurrent: (word: WordEntry) => void;
}

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function LevelSelector({
  level,
  setLevel,
  allWords,
  setCurrent,
}: LevelSelectorProps) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectLevel = (lvl: Level) => {
    setLevel(lvl);
    const next =
      allWords.find((w) => w.level === lvl && w.type === 'noun') ??
      allWords.find((w) => w.level === lvl);
    if (next) setCurrent(next);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const currentIdx = LEVELS.indexOf(level);
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIdx = (currentIdx + delta + LEVELS.length) % LEVELS.length;
    const nextLevel = LEVELS[nextIdx];
    selectLevel(nextLevel);
    btnRefs.current[nextIdx]?.focus();
  };

  return (
    <div
      className="mb-6 flex flex-wrap items-center gap-2 justify-center"
      role="tablist"
      aria-label="Select proficiency level"
      onKeyDown={onKeyDown}
    >
      {LEVELS.map((lvl, i) => {
        const active = level === lvl;
        return (
          <button
            key={lvl}
            ref={(el) => {
              btnRefs.current[i] = el; // <- return void
            }}
            type="button"
            role="tab"
            aria-selected={active}
            aria-pressed={active}
            onClick={() => selectLevel(lvl)}
            className={[
              'px-3 h-8 rounded-full text-xs font-semibold border transition',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70',
              active
                ? 'bg-blue-500 text-white border-blue-500 shadow-[0_4px_14px_rgba(59,130,246,.30)]'
                : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-gray-100',
            ].join(' ')}
          >
            {lvl}
          </button>
        );
      })}
    </div>
  );
}
