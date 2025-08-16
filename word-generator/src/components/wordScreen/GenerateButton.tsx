'use client';

import { motion } from 'framer-motion';

interface GenerateButtonProps {
  onClick: () => void;
}

export default function GenerateButton({ onClick }: GenerateButtonProps) {
  return (
    <div className="flex justify-center mb-6">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-semibold shadow-[0_8px_20px_rgba(59,130,246,.3)] transition"
      >
        <span className="inline-block -rotate-45">⇄</span>
        Generate
      </motion.button>
    </div>
  );
}
