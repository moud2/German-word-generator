'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage(error.message);
      setMessageType('error');
    } else {
      setMessage('Logged in successfully!');
      setMessageType('success');
    }
  };

  useEffect(() => {
    if (!loading && user) router.push('/');
  }, [user, loading, router]);

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
            <div className="relative rounded-[22px] bg-white/60 backdrop-blur-xl border border-gray-200 p-5 text-gray-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,.6),0_20px_50px_rgba(0,0,0,.05)]">
              <h1 className="text-2xl font-bold text-center mb-4">Log In</h1>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm text-gray-700">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>

                <div className="flex justify-center mt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-semibold shadow-[0_8px_20px_rgba(59,130,246,.3)] transition"
                  >
                    Log In
                  </button>
                </div>

                {message && (
                  <p
                    className={`text-sm text-center mt-2 ${
                      messageType === 'success' ? 'text-blue-700' : 'text-red-600'
                    }`}
                  >
                    {message}
                  </p>
                )}
              </form>

              {/* Small links row */}
              <div className="mt-4 flex items-center justify-between text-xs text-gray-600">
                <a href="/signup" className="hover:text-blue-600 underline underline-offset-2">Create account</a>
                <a href="/forgot-password" className="hover:text-blue-600 underline underline-offset-2">Forgot password?</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
