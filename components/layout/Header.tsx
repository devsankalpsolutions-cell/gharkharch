'use client';

import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { getAvailableMonthsList } from '@/lib/formatters';
import { Sun, Moon, Plus, ArrowRightLeft, LogOut, Calendar, Database, RefreshCw } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    dbConnected,
    dbStatusMessage,
    isDbLoading,
    refreshFromDb,
    setIsAddIncomeOpen,
    setIsAddExpenseOpen,
    setIsAddLiabilityOpen,
    setIsTransferOpen,
  } = useFinance();
  const { theme, setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const months = getAvailableMonthsList();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-8 py-3 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Brand title on mobile + Month Selector + DB Status */}
        <div className="flex items-center justify-between md:justify-start gap-3 flex-wrap">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              GK
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              Ghar Kharch
            </span>
          </div>

          {/* Month Selector dropdown */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none pr-1"
            >
              {months.map(m => (
                <option key={m.key} value={m.key} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* MySQL DB Status Badge */}
          <button
            onClick={refreshFromDb}
            disabled={isDbLoading}
            title={dbStatusMessage}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold shadow-xs transition-all shrink-0 cursor-pointer ${
              dbConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60 hover:bg-amber-100 dark:hover:bg-amber-900/60'
            }`}
          >
            <Database className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{dbConnected ? 'MySQL Live' : 'DB Offline'}</span>
            <RefreshCw className={`w-3 h-3 shrink-0 ${isDbLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Right: Quick Actions & Settings */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Quick Action Buttons */}
          <button
            onClick={() => setIsAddIncomeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Income</span>
          </button>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Expense</span>
          </button>

          <button
            onClick={() => setIsAddLiabilityOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Liability</span>
          </button>

          <button
            onClick={() => setIsTransferOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfer</span>
          </button>

          <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="Toggle Light / Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Logout */}
          <div className="hidden sm:flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-200 dark:border-indigo-800">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
