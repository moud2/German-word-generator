'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { supabase } from '../lib/supabaseClient';
import useAvailableMinutes from '../hooks/useAvailableMinutes';

export default function MinimalHeader() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { minutes } = useAvailableMinutes();
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleBuyMinutes = async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;

    if (!userId) {
      alert('Please log in first.');
      return;
    }

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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        event.target instanceof Node &&
        !(profileRef.current as HTMLDivElement).contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const getUserInitials = (email: string | null | undefined): string => {
    if (!email) return 'U';
    const parts = email.split('@')[0].split('.');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold text-gray-900">
              Topic Generator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher compact />
            {user ? (
              <div className="flex items-center space-x-3">
                {minutes !== null && (
                  <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                    <ClockIcon className="w-4 h-4" />
                    <span>{minutes}m</span>
                  </div>
                )}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium"
                  >
                    {getUserInitials(user.email)}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-900 truncate">{user.email}</p>
                        <button
                          onClick={handleBuyMinutes}
                          className="text-xs text-green-600 hover:underline mt-1 block"
                        >
                          + Buy More Minutes
                        </button>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                  Sign in
                </Link>
                <Link href="/signup" className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher compact />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {menuOpen ? <XMarkIcon className="w-5 h-5" /> : <Bars3Icon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content - Fixed for Safari */}
        {menuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-lg z-40">
            <div className="px-4 py-4 space-y-4">
              {user ? (
                <div className="space-y-3">
                  <div className="pb-3 border-b border-gray-100">
                    <p className="text-sm text-gray-900 font-medium truncate mb-2">{user.email}</p>
                    {minutes !== null && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg mb-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>{minutes} Times remaining</span>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        handleBuyMinutes();
                        setMenuOpen(false);
                      }}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      + Buy More Minutes
                    </button>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left text-red-600 text-sm hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link 
                    href="/login" 
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center text-gray-700 hover:text-gray-900 text-sm font-medium border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
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