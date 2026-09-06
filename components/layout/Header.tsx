'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getAvailableMonthsList } from '@/lib/formatters';
import { Sun, Moon, LogOut, Calendar } from 'lucide-react';
import { FamvexaLogo } from '../ui/FamvexaLogo';

export const Header: React.FC = () => {
  const { selectedMonth, setSelectedMonth } = useFinance();
  const { setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const months = getAvailableMonthsList();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/90 dark:bg-[#081631]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-8 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left Section: Brand Logo (Mobile) + Calendar Month Selector */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center shrink-0">
            <FamvexaLogo showTagline={false} size="sm" />
          </div>

          {/* Calendar Month Selector dropdown */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-xs">
            <Calendar className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none pr-1"
            >
              {months.map(m => (
                <option key={m.key} value={m.key} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Section: Theme Toggle Logo + User Profile Picture / Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0 cursor-pointer"
            title="Toggle Light / Dark Theme"
          >
            {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-600" />}
          </button>

          {/* User Profile Avatar & Logout */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200 dark:border-slate-800">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs border border-sky-400/30 shrink-0"
              title={user?.name || user?.email || 'User Account'}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              title="Logout from account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
