'use client';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={compact ? 'flex space-x-2' : 'flex space-x-2 mb-4'}>
      <button onClick={() => changeLanguage('en')} title="English">
        🇬🇧
      </button>
      <button onClick={() => changeLanguage('fr')} title="Français">
        🇫🇷
      </button>
      <button onClick={() => changeLanguage('ar')} title="العربية">
        🇸🇦
      </button>
    </div>
  );
}
