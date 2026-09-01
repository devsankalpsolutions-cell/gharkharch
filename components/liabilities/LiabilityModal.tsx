'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Liability, LiabilityType, LiabilityPriority, LiabilityStatus } from '@/lib/types';
import { useFinance } from '@/context/FinanceContext';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface LiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Liability | null;
}

const TYPES: LiabilityType[] = [
  'Credit Card',
  'Personal Loan',
  'Home Loan',
  'Car Loan',
  'Friend Borrow',
  'Loan',
  'EMI',
  'Other',
];

const PRIORITIES: LiabilityPriority[] = ['High', 'Medium', 'Low'];

export const LiabilityModal: React.FC<LiabilityModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { addLiability, updateLiability } = useFinance();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [type, setType] = useState<LiabilityType>('Credit Card');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidAmount, setPaidAmount] = useState('0');
  const [monthlyEmi, setMonthlyEmi] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [priority, setPriority] = useState<LiabilityPriority>('High');
  const [status, setStatus] = useState<LiabilityStatus>('Active');
  const [friendName, setFriendName] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type);
      setTotalAmount(initialData.totalAmount.toString());
      setPaidAmount(initialData.paidAmount.toString());
      setMonthlyEmi(initialData.monthlyEmi.toString());
      setDueDate(initialData.dueDate);
      setStartDate(initialData.startDate || new Date().toISOString().split('T')[0]);
      setEndDate(initialData.endDate || initialData.expectedReturnDate || '');
      setInterestRate(initialData.interestRate?.toString() || '');
      setStatus(initialData.status);
      setPriority(initialData.priority || 'Medium');
      setFriendName(initialData.friendName || '');
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setType('Credit Card');
      setTotalAmount('');
      setPaidAmount('0');
      setMonthlyEmi('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setInterestRate('');
      setPriority('High');
      setStatus('Active');
      setFriendName('');
      setNotes('');
    }
    setIsSubmitting(false);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !name || !totalAmount || !dueDate) return;

    const numTotal = parseFloat(totalAmount);
    const numPaid = parseFloat(paidAmount) || 0;
    const numEmi = parseFloat(monthlyEmi) || 0;
    const numInterest = parseFloat(interestRate) || undefined;

    if (isNaN(numTotal) || numTotal <= 0) return;

    setIsSubmitting(true);

    if (initialData) {
      updateLiability({
        ...initialData,
        name,
        type,
        totalAmount: numTotal,
        paidAmount: numPaid,
        remainingAmount: Math.max(0, numTotal - numPaid),
        monthlyEmi: numEmi,
        dueDate,
        startDate,
        endDate,
        interestRate: numInterest,
        priority,
        status,
        friendName: type === 'Friend Borrow' ? friendName : undefined,
        notes,
      });
    } else {
      addLiability({
        userId: user?.id || 'user_1',
        name,
        type,
        totalAmount: numTotal,
        monthlyEmi: numEmi,
        dueDate,
        startDate,
        endDate,
        interestRate: numInterest,
        priority,
        status,
        friendName: type === 'Friend Borrow' ? friendName : undefined,
        notes,
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Liability / Loan' : '💳 Add Liability / Loan'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Liability Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. HDFC Credit Card or Friend Borrow (Amit)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Liability Type *
            </label>
            <select
              value={type}
              onChange={e => setType(e.target.value as LiabilityType)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            >
              {TYPES.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Repayment Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as LiabilityPriority)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400"
            >
              {PRIORITIES.map(p => (
                <option key={p} value={p}>
                  {p} Priority
                </option>
              ))}
            </select>
          </div>
        </div>

        {type === 'Friend Borrow' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Friend's Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Amit Kumar"
              value={friendName}
              onChange={e => setFriendName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Total Amount (₹) *
            </label>
            <input
              type="number"
              inputMode="decimal"
              required
              min="1"
              placeholder="e.g. 50000"
              value={totalAmount}
              onChange={e => setTotalAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold text-rose-600 dark:text-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Monthly Minimum EMI (₹)
            </label>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              placeholder="e.g. 2500"
              value={monthlyEmi}
              onChange={e => setMonthlyEmi(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Next Due Date *
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Interest Rate (% p.a. optional)
            </label>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder="e.g. 14.5"
              value={interestRate}
              onChange={e => setInterestRate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Notes / Details
          </label>
          <textarea
            rows={2}
            placeholder="Optional loan or repayment notes..."
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
            className="w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{initialData ? 'Save Changes' : 'Add Liability'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
