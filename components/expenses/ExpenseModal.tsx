'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Expense, PaymentMethod } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { getAccountFromPaymentMethod } from '@/lib/storage';
import { Building2, Wallet, Loader2 } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Expense | null;
}

const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Bank Transfer', 'Credit Card', 'Debit Card', 'Cash', 'Cheque', 'Other'];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addExpense, updateExpense, selectedMonth, categories, balances } = useFinance();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<string>('Grocery');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setDate(initialData.date);
      setCategory(initialData.category);
      setCustomCategoryInput('');
      setPaymentMethod(initialData.paymentMethod);
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setAmount('');
      const defaultDate = `${selectedMonth}-15`;
      setDate(defaultDate);
      setCategory('Grocery');
      setCustomCategoryInput('');
      setPaymentMethod('UPI');
      setDescription('');
    }
    setIsSubmitting(false);
  }, [initialData, isOpen, selectedMonth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !title || !amount || !date) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);

    let success = false;
    if (initialData) {
      success = updateExpense(
        {
          ...initialData,
          title,
          amount: numAmount,
          date,
          category,
          paymentMethod,
          account: getAccountFromPaymentMethod(paymentMethod),
          description,
        },
        customCategoryInput
      );
    } else {
      success = addExpense(
        {
          userId: user?.id || 'user_1',
          title,
          amount: numAmount,
          date,
          category,
          paymentMethod,
          description,
        },
        customCategoryInput
      );
    }

    setIsSubmitting(false);
    if (success) onClose();
  };

  const targetAccount = getAccountFromPaymentMethod(paymentMethod);
  const availableBal = targetAccount === 'Bank' ? balances.bankBalance : balances.walletBalance;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Expense Record' : '💸 Add Expense Record'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expense Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. D-Mart Grocery Supplies"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Amount (₹) *
            </label>
            <input
              type="number"
              inputMode="decimal"
              required
              min="1"
              placeholder="e.g. 4500"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Expense Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              {PAYMENT_METHODS.map(pm => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Account Indicator */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-2xl flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 font-semibold">
            {targetAccount === 'Bank' ? <Building2 className="w-4 h-4 text-indigo-500" /> : <Wallet className="w-4 h-4 text-emerald-500" />}
            <span>Deducts from {targetAccount}</span>
          </div>
          <span className="font-extrabold text-slate-900 dark:text-slate-100">
            Avail: ₹{availableBal.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Custom Category */}
        {category === 'Other' && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1">
            <label className="block text-xs font-bold text-rose-700 dark:text-rose-300">
              Enter Custom Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Pet Care"
              value={customCategoryInput}
              onChange={e => setCustomCategoryInput(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-rose-300 dark:border-rose-700 rounded-lg text-sm"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description / Notes
          </label>
          <textarea
            rows={2}
            placeholder="Optional details..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
          />
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{initialData ? 'Save Changes' : 'Add Expense'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
