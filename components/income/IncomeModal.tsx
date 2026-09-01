'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Income, PaymentMethod, AccountType } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { Building2, Wallet, Loader2 } from 'lucide-react';

interface IncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Income | null;
}

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment Return', 'Gift / Bonus', 'Rental Income', 'Other'];
const PAYMENT_METHODS: PaymentMethod[] = ['Bank Transfer', 'UPI', 'Cash', 'Cheque', 'Other'];

export const IncomeModal: React.FC<IncomeModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addIncome, updateIncome, selectedMonth, balances } = useFinance();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Salary');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [receivedIn, setReceivedIn] = useState<AccountType>('Bank');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setDate(initialData.date);
      setCategory(initialData.category);
      setPaymentMethod(initialData.paymentMethod || 'Bank Transfer');
      setReceivedIn(initialData.receivedIn || 'Bank');
      setDescription(initialData.description || '');
    } else {
      setTitle('');
      setAmount('');
      const defaultDate = `${selectedMonth}-01`;
      setDate(defaultDate);
      setCategory('Salary');
      setPaymentMethod('Bank Transfer');
      setReceivedIn('Bank');
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

    if (initialData) {
      updateIncome({
        ...initialData,
        title,
        amount: numAmount,
        date,
        category,
        paymentMethod,
        receivedIn,
        description,
      });
    } else {
      addIncome({
        userId: user?.id || 'user_1',
        title,
        amount: numAmount,
        date,
        category,
        paymentMethod,
        receivedIn,
        description,
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Income Record' : '💰 Add Income Record'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Income Source / Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Monthly Salary or Client Payment"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              placeholder="e.g. 50000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Received Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            >
              {INCOME_CATEGORIES.map(cat => (
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
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            >
              {PAYMENT_METHODS.map(pm => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Deposit Account *
            </label>
            <select
              value={receivedIn}
              onChange={e => setReceivedIn(e.target.value as AccountType)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400"
            >
              <option value="Bank">Bank Balance</option>
              <option value="Wallet">Wallet / Cash</option>
            </select>
          </div>
        </div>

        {/* Deposit account status */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200 border border-indigo-200/50">
          <div className="flex items-center gap-1.5 font-semibold">
            {receivedIn === 'Bank' ? <Building2 className="w-4 h-4 text-indigo-500" /> : <Wallet className="w-4 h-4 text-emerald-500" />}
            <span>Will add money directly into your {receivedIn} Account</span>
          </div>
        </div>

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
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{initialData ? 'Save Changes' : 'Add Income'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
