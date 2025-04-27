'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext'; // ✅ import Auth
import LanguageSwitcher from './LanguageSwitcher';
import { supabase } from '../lib/supabaseClient'; // ✅ import supabase to log out

export default function Header() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false); // Close menu if on mobile
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-green-50 shadow">
      <Link href="/" className="text-green-700 font-bold text-lg">
        Word Generator
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <LanguageSwitcher compact />
        {user ? (
          <>
            {/* ✅ Logged in */}
            <span className="text-green-700">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-green-700 hover:underline"
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            {/* ✅ Logged out */}
            <Link href="/login" className="text-green-700 hover:underline">
              Sign In
            </Link>
            <Link href="/signup" className="text-green-700 hover:underline">
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="flex md:hidden items-center gap-2">
        <LanguageSwitcher compact />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-green-700 focus:outline-none"
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 right-4 bg-white border border-green-300 rounded-lg shadow-lg p-4 flex flex-col gap-2 z-50">
          {user ? (
            <>
              <span className="text-green-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-green-700 hover:underline text-left"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-green-700 hover:underline" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="text-green-700 hover:underline" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
