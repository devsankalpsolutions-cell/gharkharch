'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Trip, TripSplitMethod, TripExpenseShare, PaymentMethod } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { getAccountFromPaymentMethod } from '@/lib/storage';
import { Sparkles, CheckSquare, Square, Loader2 } from 'lucide-react';

interface TripExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

const CATEGORIES = ['Food & Dining', 'Travel & Fuel', 'Stay & Hotel', 'Activities & Fun', 'Shopping', 'Other'];
const PAYMENT_METHODS: PaymentMethod[] = ['UPI', 'Bank Transfer', 'Credit Card', 'Cash', 'Other'];

export const TripExpenseModal: React.FC<TripExpenseModalProps> = ({
  isOpen,
  onClose,
  trip,
}) => {
  const { addTripExpense, balances } = useFinance();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Food & Dining');
  const [paidBy, setPaidBy] = useState(trip.participants[0]?.id || '');
  const [splitMethod, setSplitMethod] = useState<TripSplitMethod>('equal');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState('');
  const [syncToPersonal, setSyncToPersonal] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !title || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);

    // Calculate equal shares
    const perPerson = Math.round((numAmount / trip.participants.length) * 100) / 100;
    const shares: TripExpenseShare[] = trip.participants.map(p => ({
      participantId: p.id,
      shareAmount: perPerson,
    }));

    addTripExpense(
      {
        tripId: trip.id,
        title,
        amount: numAmount,
        date,
        category,
        paidByParticipantId: paidBy,
        splitMethod,
        shares,
        paymentMethod,
        notes,
      },
      syncToPersonal
    );

    setIsSubmitting(false);
    setTitle('');
    setAmount('');
    setNotes('');
    onClose();
  };

  const targetAccount = getAccountFromPaymentMethod(paymentMethod);
  const availableBal = targetAccount === 'Bank' ? balances.bankBalance : balances.walletBalance;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🏖️ Add Trip Expense"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Expense Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Seafood Dinner or Beach Resort Stay"
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
              placeholder="e.g. 3500"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Paid By *
            </label>
            <select
              value={paidBy}
              onChange={e => setPaidBy(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold"
            >
              {trip.participants.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sync to personal bank option */}
        <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/60 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Record in my Personal Money Ledger?
              </p>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400">
                Avail: ₹{availableBal.toLocaleString('en-IN')} ({targetAccount})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSyncToPersonal(!syncToPersonal)}
            className="text-indigo-600 dark:text-indigo-400 shrink-0"
          >
            {syncToPersonal ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add notes..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
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
              <span>Add Trip Expense</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
