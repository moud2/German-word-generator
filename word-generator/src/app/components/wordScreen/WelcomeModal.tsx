'use client';

import { XMarkIcon } from '@heroicons/react/24/solid';
import LanguageSwitcher from '../LanguageSwitcher';

interface WelcomeModalProps {
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  tips: string[];
  t: any;
  i18n: any;
}

export default function WelcomeModal({
  showWelcome,
  setShowWelcome,
  tips,
  t,
  i18n,
}: WelcomeModalProps) {
  return (
    <div
      className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border border-green-400 rounded-lg p-6 shadow-xl z-50"
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-green-700">{t('welcome.title')}</h2>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button
            onClick={() => setShowWelcome(false)}
            className="text-green-500 hover:text-green-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className={`mt-2 text-sm text-gray-700 leading-relaxed ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
        {t('welcome.instructions')}
      </div>

      <div className={`mt-4 text-sm text-gray-700 leading-relaxed ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
        {t('welcome.tips_title')}
      </div>

      <ul className={`list-disc list-inside mt-1 text-sm text-gray-700 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
        {Array.isArray(tips) &&
          tips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
      </ul>
    </div>
  );
}
