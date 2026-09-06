'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  Plane,
  Home,
  ArrowRightLeft,
  PieChart,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { useFinance } from '@/context/FinanceContext';
import { FamvexaLogo } from '../ui/FamvexaLogo';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Money & Balances', href: '/dashboard/money', icon: Wallet },
  { label: 'Income', href: '/dashboard/income', icon: TrendingUp },
  { label: 'Expenses', href: '/dashboard/expenses', icon: TrendingDown },
  { label: 'Liabilities', href: '/dashboard/liabilities', icon: ShieldAlert },
  { label: 'Trips (Splitwise)', href: '/dashboard/trips', icon: Plane },
  { label: 'Manage House / PG', href: '/dashboard/house', icon: Home },
  { label: 'Transactions', href: '/dashboard/transactions', icon: ArrowRightLeft },
  { label: 'Monthly Summary', href: '/dashboard/summary', icon: PieChart },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { setIsAddExpenseOpen } = useFinance();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#081631] min-h-screen p-4 transition-colors shrink-0">
      {/* Brand Header */}
      <div className="px-2 py-3 mb-5">
        <FamvexaLogo showTagline={true} showSubCredit={true} size="lg" />
      </div>

      {/* Primary Action Button */}
      <button
        onClick={() => setIsAddExpenseOpen(true)}
        className="w-full mb-6 py-2.5 px-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold text-sm shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
      >
        <PlusCircle className="w-4 h-4" />
        <span>New Expense</span>
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-300 font-semibold shadow-xs border border-cyan-200/60 dark:border-cyan-800/40'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? 'text-cyan-600 dark:text-cyan-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Banner */}
      <div className="mt-auto p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Multi-Tenant SaaS</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
          Famvexa • A Devsankalp Solutions product
        </p>
      </div>
    </aside>
  );
};
