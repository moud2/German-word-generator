'use client';

interface ComingSoonBoxProps {
  features: string[];
  t: any;
}

export default function ComingSoonBox({ features, t }: ComingSoonBoxProps) {
  return (
    <div className="mt-10 bg-yellow-50 border border-yellow-300 rounded-lg shadow-sm text-sm text-yellow-800 px-4 py-3 max-w-md w-full">
      <h3 className="font-bold mb-1">{t('welcome.coming_soon_title')}</h3>
      <ul className="list-disc list-inside">
        {features.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
