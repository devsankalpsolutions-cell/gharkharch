'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFinance } from '@/context/FinanceContext';
import { Modal } from '@/components/ui/Modal';
import {
  LayoutDashboard,
  Wallet,
  Plane,
  Home,
  Plus,
  ArrowRightLeft,
  PieChart,
  ShieldAlert,
  Settings,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  IndianRupee,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const {
    setIsAddIncomeOpen,
    setIsAddExpenseOpen,
    setIsAddLiabilityOpen,
  } = useFinance();

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const mainNavItems = [
    { label: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Money', href: '/dashboard/money', icon: Wallet },
    // FAB position in center
    { label: 'Trips', href: '/dashboard/trips', icon: Plane },
    { label: 'House', href: '/dashboard/house', icon: Home },
  ];

  const moreItems = [
    { label: 'Income Ledger', href: '/dashboard/income', icon: TrendingUp },
    { label: 'Expense Ledger', href: '/dashboard/expenses', icon: TrendingDown },
    { label: 'Liabilities & Loans', href: '/dashboard/liabilities', icon: ShieldAlert },
    { label: 'Unified Transactions', href: '/dashboard/transactions', icon: ArrowRightLeft },
    { label: 'Monthly Summary', href: '/dashboard/summary', icon: PieChart },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-3 py-2">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {/* Home */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] rounded-xl transition-all ${
              pathname === '/dashboard'
                ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Home</span>
          </Link>

          {/* Money */}
          <Link
            href="/dashboard/money"
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] rounded-xl transition-all ${
              pathname === '/dashboard/money'
                ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Money</span>
          </Link>

          {/* Central Quick Add FAB */}
          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 -mt-5 transition-transform active:scale-95 cursor-pointer"
            aria-label="Quick Add Action"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Trips */}
          <Link
            href="/dashboard/trips"
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] rounded-xl transition-all ${
              pathname.startsWith('/dashboard/trips')
                ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Plane className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">Trips</span>
          </Link>

          {/* House */}
          <Link
            href="/dashboard/house"
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] rounded-xl transition-all ${
              pathname.startsWith('/dashboard/house')
                ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">House</span>
          </Link>

          {/* More Menu */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-slate-500 dark:text-slate-400"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-0.5">More</span>
          </button>
        </div>
      </nav>

      {/* Quick Add Bottom Sheet Modal */}
      <Modal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title="⚡ Quick Add Action"
        maxWidth="max-w-md"
      >
        <div className="grid grid-cols-2 gap-3 py-2">
          <button
            onClick={() => {
              setIsQuickAddOpen(false);
              setIsAddExpenseOpen(true);
            }}
            className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-left space-y-1 hover:bg-emerald-100 transition-colors"
          >
            <div className="p-2 bg-emerald-600 text-white rounded-xl w-fit">
              <TrendingDown className="w-5 h-5" />
            </div>
            <p className="font-extrabold text-sm text-slate-900 dark:text-white">Personal Expense</p>
            <p className="text-[11px] text-slate-500">Record daily expense</p>
          </button>

          <button
            onClick={() => {
              setIsQuickAddOpen(false);
              setIsAddIncomeOpen(true);
            }}
            className="p-4 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-2xl text-left space-y-1 hover:bg-indigo-100 transition-colors"
          >
            <div className="p-2 bg-indigo-600 text-white rounded-xl w-fit">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="font-extrabold text-sm text-slate-900 dark:text-white">Personal Income</p>
            <p className="text-[11px] text-slate-500">Salary or freelance</p>
          </button>

          <button
            onClick={() => {
              setIsQuickAddOpen(false);
              setIsAddLiabilityOpen(true);
            }}
            className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-left space-y-1 hover:bg-rose-100 transition-colors"
          >
            <div className="p-2 bg-rose-600 text-white rounded-xl w-fit">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <p className="font-extrabold text-sm text-slate-900 dark:text-white">Loan / Liability</p>
            <p className="text-[11px] text-slate-500">Credit card or loan</p>
          </button>

          <Link
            href="/dashboard/trips"
            onClick={() => setIsQuickAddOpen(false)}
            className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 rounded-2xl text-left space-y-1 hover:bg-purple-100 transition-colors block"
          >
            <div className="p-2 bg-purple-600 text-white rounded-xl w-fit">
              <Plane className="w-5 h-5" />
            </div>
            <p className="font-extrabold text-sm text-slate-900 dark:text-white">Trip Expense</p>
            <p className="text-[11px] text-slate-500">Goa / Group trip</p>
          </Link>

          <Link
            href="/dashboard/house"
            onClick={() => setIsQuickAddOpen(false)}
            className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 rounded-2xl text-left space-y-1 hover:bg-teal-100 transition-colors block col-span-2"
          >
            <div className="p-2 bg-teal-600 text-white rounded-xl w-fit">
              <Home className="w-5 h-5" />
            </div>
            <p className="font-extrabold text-sm text-slate-900 dark:text-white">House / PG Expense or Income</p>
            <p className="text-[11px] text-slate-500">Flat rent, maid, electricity, room contribution</p>
          </Link>
        </div>
      </Modal>

      {/* More Options Bottom Sheet */}
      <Modal
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        title="📱 More Applications & Features"
        maxWidth="max-w-md"
      >
        <div className="space-y-2 py-2">
          {moreItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMoreOpen(false)}
                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="p-2 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 rounded-xl shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </Modal>
    </>
  );
};
