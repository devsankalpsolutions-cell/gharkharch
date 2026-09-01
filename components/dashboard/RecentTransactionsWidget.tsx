'use client';

import React from 'react';
import Link from 'next/link';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { TrendingUp, TrendingDown, ShieldAlert, ArrowRight } from 'lucide-react';

export const RecentTransactionsWidget: React.FC = () => {
  const { unifiedTransactions, selectedMonth } = useFinance();
  const { user } = useAuth();

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // Filter transactions for the selected month and take top 6
  const monthTxs = unifiedTransactions
    .filter(tx => tx.date.startsWith(selectedMonth))
    .slice(0, 6);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            Recent Activity
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Latest transactions for selected month
          </p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {monthTxs.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No transactions recorded for this month.
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {monthTxs.map(tx => (
            <div key={tx.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    tx.type === 'Income'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : tx.type === 'Expense'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                      : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {tx.type === 'Income' && <TrendingUp className="w-4 h-4" />}
                  {tx.type === 'Expense' && <TrendingDown className="w-4 h-4" />}
                  {tx.type === 'Liability Payment' && <ShieldAlert className="w-4 h-4" />}
                </div>

                <div>
                  <h5 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                    {tx.title}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>{formatDate(tx.date)}</span>
                    <span>•</span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-[11px]">
                      {tx.category}
                    </span>
                    <span>•</span>
                    <span>{tx.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <div
                className={`font-bold text-sm text-right ${
                  tx.type === 'Income'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : tx.type === 'Expense'
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {tx.type === 'Income' ? '+' : '-'}
                {formatCurrency(tx.amount, currency, formatStyle)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
