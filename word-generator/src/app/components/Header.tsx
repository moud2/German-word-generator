'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bars3Icon,
  XMarkIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { supabase } from '../lib/supabaseClient';
import useAvailableMinutes from '../hooks/useAvailableMinutes';

export default function MinimalHeader() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const minutes = useAvailableMinutes();
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    setProfileOpen(false);
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-2">
                  <div className="flex items-center justify-center w-7 h-7 bg-green-600 text-white rounded-full text-xs font-medium">
                    {getUserInitials(user.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    {minutes !== null && (
                      <div className="flex items-center space-x-1 mt-1">
                        <ClockIcon className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">{minutes} minutes remaining</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="block px-2 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
