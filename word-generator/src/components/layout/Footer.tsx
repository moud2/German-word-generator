'use client';

import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 text-sm text-gray-500 text-center py-6">
      <p>
        {t('contact')}: <a href="mailto:dr0silver.contact@gmail.com" className="text-green-700 hover:underline">dr0silver.contact@gmail.com</a>
      </p>
      <p>
        TikTok: <a href="https://www.tiktok.com/@dr.siiver" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">@dr.siiver</a>
      </p>
    </footer>
  );
}
