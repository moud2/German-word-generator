'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Recorder() {
  const { i18n } = useTranslation();

  const comingSoonText = {
    en: '🔒 Coming Soon',
    de: '🔒 Kommt bald',
    ar: '🔒 قريباً',
  }[i18n.language] || '🔒 Coming Soon';

  return (
    <div className="relative border-2 border-green-500 rounded-lg p-4 bg-white shadow-md">
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-semibold text-green-700">🎤 Voice Recorder</span>
      </div>

      {/* Disabled Button */}
      <button
        disabled
        className="w-full bg-green-600 text-white font-semibold py-3 rounded-full cursor-not-allowed"
      >
        Start Recording
      </button>

      {/* Yellow "Coming Soon" box inside */}
      <div className="absolute top-2 right-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-medium px-3 py-1 rounded">
        {comingSoonText}
      </div>
    </div>
  );
}
