'use client';

import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { UnifiedTransaction, TransactionType } from '@/lib/types';
import { formatCurrency, formatDate, formatMonthYear } from '@/lib/formatters';
import {
  ArrowRightLeft,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  ArrowUpDown,
  Download,
} from 'lucide-react';

export default function TransactionsPage() {
  const { unifiedTransactions, selectedMonth } = useFinance();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');

  const currency = user?.currency || 'INR';
  const formatStyle = user?.numberFormat || 'indian';

  // Filter transactions
  let filtered = unifiedTransactions.filter(tx => {
    const matchesMonth = tx.date.startsWith(selectedMonth);
    const matchesType = selectedType === 'All' || tx.type === selectedType;
    const matchesCategory = selectedCategory === 'All' || tx.category === selectedCategory;
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.description && tx.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMonth && matchesType && matchesCategory && matchesSearch;
  });

  // Sort transactions
  filtered.sort((a, b) => {
    if (sortOrder === 'date-desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortOrder === 'date-asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortOrder === 'amount-desc') return b.amount - a.amount;
    if (sortOrder === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Title', 'Category', 'Payment Method', 'Amount (INR)', 'Description'];
    const rows = filtered.map(tx => [
      tx.date,
      tx.type,
      `"${tx.title}"`,
      tx.category,
      tx.paymentMethod,
      tx.amount,
      `"${tx.description || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GharKharch_Transactions_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Financial Ledger</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Unified Transaction Feed ({formatMonthYear(selectedMonth)})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Single view of all income deposits, daily expenses, and loan EMI payments.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-sm transition-all shrink-0 border border-slate-200 dark:border-slate-700"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Transaction Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Types</option>
            <option value="Income">Income Only</option>
            <option value="Expense">Expenses Only</option>
            <option value="Liability Payment">Liability EMI Payments</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="flex items-center gap-2 md:col-span-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value as any)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="date-desc">Newest First (Date ↓)</option>
            <option value="date-asc">Oldest First (Date ↑)</option>
            <option value="amount-desc">Highest Amount First (Amount ↓)</option>
            <option value="amount-asc">Lowest Amount First (Amount ↑)</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4">
            <ArrowRightLeft className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-base">
              No Matching Transactions
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try modifying your search filter or selecting another month.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-xs border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Title & Notes</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map(tx => (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          tx.type === 'Income'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                            : tx.type === 'Expense'
                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                        }`}
                      >
                        {tx.type === 'Income' && <TrendingUp className="w-3.5 h-3.5" />}
                        {tx.type === 'Expense' && <TrendingDown className="w-3.5 h-3.5" />}
                        {tx.type === 'Liability Payment' && <ShieldAlert className="w-3.5 h-3.5" />}
                        <span>{tx.type}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 dark:text-slate-100">
                        {tx.title}
                      </p>
                      {tx.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {tx.description}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                      {tx.category}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs">
                      {formatDate(tx.date)}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-right font-extrabold ${
                        tx.type === 'Income'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : tx.type === 'Expense'
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {tx.type === 'Income' ? '+' : '-'}
                      {formatCurrency(tx.amount, currency, formatStyle)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
