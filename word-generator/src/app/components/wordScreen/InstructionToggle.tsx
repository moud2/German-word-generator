'use client';

import { LightBulbIcon } from '@heroicons/react/24/solid';

interface InstructionToggleProps {
  onClick: () => void;
}

export default function InstructionToggle({ onClick }: InstructionToggleProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 bg-white border border-yellow-400 text-yellow-500 hover:bg-yellow-50 rounded-full p-3 shadow-lg z-40 flex items-center"
      title="Show instructions"
    >
      <LightBulbIcon className="h-6 w-6" />
    </button>
  );
}
