'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-poppins',
});

export default function SuccessPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <div className={`${poppins.variable} font-sans min-h-screen flex flex-col items-center justify-center px-4 bg-white text-center`}>
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Purchase Successful!</h1>
      <p className="text-gray-700 text-lg mb-2">
        Thank you! Your minutes will be added shortly.
      </p>
      {user && (
        <p className="text-sm text-gray-500 mb-4">
          You are logged in as <strong>{user.email}</strong>
        </p>
      )}

      <button
        onClick={handleRedirect}
        className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
      >
        Go to Homepage
      </button>
    </div>
  );
}
