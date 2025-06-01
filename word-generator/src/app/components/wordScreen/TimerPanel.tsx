'use client';

import {
  MinusIcon,
  PlusIcon,
  PauseIcon,
  PlayIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

interface TimerPanelProps {
  minutes: number;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  handleToggle: () => void;
  handleReset: () => void;
  format: () => string;
}

export default function TimerPanel({
  minutes,
  setMinutes,
  isRunning,
  handleToggle,
  handleReset,
  format,
}: TimerPanelProps) {
  return (
    <div className="mt-8 w-full max-w-md border-2 border-green-600 bg-white rounded-lg p-6 flex flex-col items-center shadow-lg">
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
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center"
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
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center"
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
  );
}