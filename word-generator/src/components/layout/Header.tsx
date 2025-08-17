'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../app/context/AuthContext';
// import LanguageSwitcher from '../LanguageSwitcher'; // ← removed
import { supabase } from '../../app/lib/supabaseClient';
import useAvailableMinutes from '../../hooks/useAvailableMinutes';

export default function MinimalHeader() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { minutes } = useAvailableMinutes();
  const profileRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleBuyMinutes = async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return alert('Please log in first.');

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        price_id: 'price_1RcnHLCX5IVNSF5N3q1aCYai',
      }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const getUserInitials = (email?: string | null) => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    return (parts[0][0] + (parts[1]?.[0] ?? email[1] ?? '')).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Bar */}
        <div className="flex h-14 items-center justify-between">
         <Link href="/" className="flex items-center gap-2">
  <span className="text-lg font-semibold tracking-tight text-gray-800">
    Topic Generator
  </span>
  <span
    aria-label="beta"
    className="rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 ring-1 ring-blue-200"
  >
    Beta
  </span>
</Link>


          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {/* <LanguageSwitcher compact /> */} {/* ← removed */}

            {user ? (
              <div className="flex items-center gap-3">
                {minutes !== null && (
                  <div className="hidden sm:flex items-center gap-1 text-xs text-gray-700 bg-white/70 border border-gray-200 rounded-full px-2 py-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{minutes} Times</span>
                  </div>
                )}

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-medium ring-1 ring-white/60 hover:bg-blue-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                  >
                    {getUserInitials(user.email)}
                  </button>

                  {profileOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200 shadow-[0_8px_20px_rgba(0,0,0,.08)] overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm text-gray-900 truncate">{user.email}</p>
                        <button
                          onClick={handleBuyMinutes}
                          className="mt-1 text-xs text-blue-600 hover:underline"
                        >
                          + Buy More Minutes
                        </button>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold shadow-[0_6px_16px_rgba(59,130,246,.28)] transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile trigger */}
          <div className="md:hidden flex items-center gap-2">
            {/* <LanguageSwitcher compact /> */} {/* ← removed */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-md text-gray-700 hover:bg-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Toggle menu"
            >
              {menuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Sheet */}
        {menuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full z-40 bg-white/80 backdrop-blur-xl border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {user ? (
                <div className="space-y-3">
                  <div className="pb-3 border-b border-gray-200">
                    <p className="mb-2 truncate text-sm font-medium text-gray-900">{user.email}</p>

                    {minutes !== null && (
                      <div className="mb-2 flex items-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-3 py-2 text-sm text-gray-700">
                        <ClockIcon className="h-4 w-4" />
                        <span>{minutes} Times remaining</span>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        handleBuyMinutes();
                        setMenuOpen(false);
                      }}
                      className="w-full rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_6px_16px_rgba(59,130,246,.28)] hover:bg-blue-400 transition"
                    >
                      + Buy More Minutes
                    </button>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full rounded-full bg-blue-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_6px_16px_rgba(59,130,246,.28)] hover:bg-blue-400 transition"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
  