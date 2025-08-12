'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('Verifying...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setSuccess(false);
        setMessage('Invalid verification link.');
        return;
      }
      try {
        const res = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const result = await res.json();

        if (res.ok) {
          setSuccess(true);
          setMessage('Email confirmed successfully! You can now log in.');
        } else {
          setSuccess(false);
          setMessage(result.error || 'Verification failed.');
        }
      } catch (err) {
        console.error(err);
        setSuccess(false);
        setMessage('Something went wrong. Please try again.');
      }
    };

    verify();
  }, [token]);

  const isVerifying = message === 'Verifying...';

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-[#f5f7fa] to-[#e8f0f8]">
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
              {/* Icon + message */}
              <div className="flex items-center justify-center gap-2 mb-1" role="status" aria-live="polite">
                {isVerifying ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                ) : success ? (
                  <CheckCircle2 className="h-5 w-5 text-blue-700" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <h1 className={`text-xl font-bold ${success ? 'text-blue-700' : isVerifying ? 'text-gray-700' : 'text-red-600'}`}>
                  {message}
                </h1>
              </div>

              {isVerifying && <p className="mt-1 text-xs text-gray-500">Please wait…</p>}

              {/* CTA */}
              {success && (
                <div className="mt-4">
                  <a
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-semibold shadow-[0_8px_20px_rgba(59,130,246,.3)] transition"
                  >
                    Go to Login
                  </a>
                </div>
              )}

              {!success && !isVerifying && (
                <p className="mt-3 text-xs text-gray-600">
                  Need a new link? Check spam or request another from the signup page.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
