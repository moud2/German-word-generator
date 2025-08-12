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

  const handleRedirect = () => router.push('/');

  return (
    <div className={`${poppins.variable} font-sans relative min-h-screen flex flex-col bg-gradient-to-b from-[#f5f7fa] to-[#e8f0f8]`}>
      {/* Background dots */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"
      />

      {/* Centered shell */}
      <main className="flex flex-1 items-center justify-center relative z-10 px-4 py-10">
        <div className="relative">
          {/* light halo */}
          <div className="pointer-events-none absolute w-[420px] h-[520px] -top-16 left-1/2 -translate-x-1/2 rounded-[32px] bg-[radial-gradient(80%_120%_at_50%_0%,rgba(255,255,255,.8),transparent_50%)] blur-xl opacity-60" />

          {/* OUTER LIGHT SHELL */}
          <div className="relative w-[400px] max-w-full rounded-[28px] p-3 ring-1 ring-white/60 bg-gradient-to-b from-blue-200/60 to-white/60 backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,.6),0_20px_60px_rgba(0,0,0,.05)]">
            {/* INNER GLASS CARD */}
            <div className="relative rounded-[22px] bg-white/60 backdrop-blur-xl border border-gray-200 p-6 text-gray-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,.6),0_20px_50px_rgba(0,0,0,.05)] text-center">
              <h1 className="text-3xl font-bold text-blue-700 mb-3">🎉 Purchase Successful!</h1>
              <p className="text-gray-700 mb-1">Thank you! Your minutes will be added shortly.</p>
              {user && (
                <p className="text-sm text-gray-500 mb-4">
                  You’re logged in as <strong>{user.email}</strong>
                </p>
              )}

              <div className="flex justify-center">
                <button
                  onClick={handleRedirect}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-semibold shadow-[0_8px_20px_rgba(59,130,246,.3)] transition"
                >
                  Go to Homepage
                </button>
              </div>

              {/* Optional: tiny hint */}
              <p className="mt-3 text-xs text-gray-500">You can start practicing right away on the home page.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
