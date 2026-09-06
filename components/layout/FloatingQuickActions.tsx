'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Plus, TrendingUp, TrendingDown, ShieldAlert, ArrowRightLeft, Sparkles, X } from 'lucide-react';

export const FloatingQuickActions: React.FC = () => {
  const {
    setIsAddIncomeOpen,
    setIsAddExpenseOpen,
    setIsAddLiabilityOpen,
    setIsTransferOpen,
  } = useFinance();

  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40 animate-in fade-in duration-200">
      {/* Floating Left Bottom Popup Menu */}
      {isOpen && (
        <div className="mb-3 w-56 bg-white dark:bg-[#0D2044] border border-slate-200 dark:border-[#1E3A8A] rounded-2xl p-2 shadow-2xl space-y-1 animate-in slide-in-from-bottom-2 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" /> Quick Actions
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-200 p-0.5 rounded-lg"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsAddIncomeOpen(true);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-sky-600 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded-xl transition-colors text-left cursor-pointer"
          >
            <div className="w-6.5 h-6.5 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span>+ Add Income</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsAddExpenseOpen(true);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors text-left cursor-pointer"
          >
            <div className="w-6.5 h-6.5 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
            <span>+ Add Expense</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsAddLiabilityOpen(true);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-amber-600 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-xl transition-colors text-left cursor-pointer"
          >
            <div className="w-6.5 h-6.5 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span>+ Add Liability</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              setIsTransferOpen(true);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors text-left cursor-pointer"
          >
            <div className="w-6.5 h-6.5 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </div>
            <span>Money Transfer</span>
          </button>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-xs rounded-full shadow-xl shadow-sky-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer border border-white/20"
        title="Quick Transactions Menu"
      >
        <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        <span className="hidden sm:inline">Quick Action</span>
      </button>
    </div>
  );
};
