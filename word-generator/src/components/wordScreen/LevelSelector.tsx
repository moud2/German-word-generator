'use client';

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
  return (
    <div className="mb-6 flex flex-wrap gap-2 justify-center">
      {LEVELS.map((lvl) => (
        <button
          key={lvl}
          onClick={() => {
            setLevel(lvl);
            const next = allWords.find((w) => w.level === lvl && w.type === 'noun');
            if (next) setCurrent(next);
          }}
          className={`px-4 py-2 rounded-full font-semibold border ${
            level === lvl
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-green-700 border-green-400 hover:bg-green-100'
          }`}
        >
          {lvl}
        </button>
      ))}
    </div>
  );
}
