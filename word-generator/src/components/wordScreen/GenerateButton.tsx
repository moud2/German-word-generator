'use client';

import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

interface GenerateButtonProps {
  onClick: () => void;
}

export default function GenerateButton({ onClick }: GenerateButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="mt-10 inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
    >
      <ArrowsRightLeftIcon className="h-6 w-6 mr-2" />
      Generate
    </motion.button>
  );
}
